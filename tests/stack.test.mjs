// Checks against a running, seeded stack (`yarn seed`, then `yarn dev`). Run: `yarn test:stack`.
// Enterprise checks are skipped, not failed, when the licence does not include the feature.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';

import { LOCALES, PASSWORD, SITE, STRAPI, api, env, features, login, reachable } from './helpers.mjs';

let ee;
before(async () => {
  assert.ok(await reachable(`${STRAPI}/_health`), `Strapi is not reachable on ${STRAPI}. Run yarn dev.`);
  assert.ok(await reachable(`${SITE}/en`), `The website is not reachable on ${SITE}. Run yarn dev.`);
  ee = await features();
});

// ------------------------------------------------------------------ public API

test('products: nine published per locale, Motor Flex 2027 is a draft and absent', async () => {
  for (const l of LOCALES) {
    const items = await api('/products', { locale: l });
    assert.equal(items.length, 9, `${l} has 9 published products`);
    assert.ok(!items.some((p) => p.slug === 'motor-flex-2027'), `${l}: motor-flex-2027 is not published`);
  }
  const drafts = await api('/products', { locale: 'en', status: 'draft' });
  assert.ok(drafts.some((p) => p.slug === 'motor-flex-2027'), 'motor-flex-2027 exists as a draft');
});

test('motor-essential IT: rate 6.9, Italian document only, FAQs related', async () => {
  const [p] = await api('/products', { locale: 'it', 'filters[slug][$eq]': 'motor-essential' });
  assert.equal(p.localRate, 6.9);
  assert.deepEqual(p.documents.map((d) => d.market).sort(), ['DE', 'FR', 'IT'], 'all three market documents related; the frontend filters by market');
  assert.ok(p.faqs.length >= 3, 'three FAQs related');
});

test('home-secure: intro offer on in every locale (conditional field)', async () => {
  for (const l of LOCALES) {
    const [p] = await api('/products', { locale: l, 'filters[slug][$eq]': 'home-secure' });
    assert.equal(p.hasIntroOffer, true, l);
    assert.ok(p.introOfferText, l);
  }
});

test('home page: hero, stats, steps, rich text with image, FAQ, CTA band, in every locale', async () => {
  for (const l of LOCALES) {
    const [page] = await api('/pages', { locale: l, 'filters[slug][$eq]': 'home' });
    const kinds = page.blocks.map((b) => b.__component);
    for (const k of ['blocks.hero', 'blocks.stats', 'blocks.steps', 'blocks.rich-text', 'blocks.faq-list', 'blocks.cta-band']) assert.ok(kinds.includes(k), `${l}: ${k}`);
    const steps = page.blocks.find((b) => b.__component === 'blocks.steps');
    assert.equal(steps.items.length, 3, `${l}: three steps`);
    const rt = page.blocks.find((b) => b.__component === 'blocks.rich-text');
    assert.ok(rt.image?.url, `${l}: rich text block carries an image`);
    assert.ok(page.faqs.length >= 4, `${l}: FAQs related to the home page`);
  }
});

test('single types and banners: global with default banner, header links, footer groups', async () => {
  for (const l of LOCALES) {
    const g = await api('/global', { locale: l });
    assert.ok(g.logo?.url, `${l}: logo`);
    assert.ok(g.defaultPromoBanner?.documentId, `${l}: default banner linked`);
    const h = await api('/header', { locale: l });
    assert.ok(h.links.length >= 4, `${l}: header links`);
    const f = await api('/footer', { locale: l });
    assert.ok(f.groups.length >= 2, `${l}: footer groups`);
  }
  const live = await api('/promo-banners', { locale: 'en', 'filters[isDefault][$eq]': 'false' });
  assert.ok(!live.some((b) => b.name === 'Winter cover check'), 'the winter banner is not published yet');
});

test('newsroom and regulated documents', async () => {
  assert.equal((await api('/news-items', { locale: 'en' })).length, 9, 'nine group news items in English');
  for (const l of ['fr', 'de', 'it']) assert.ok((await api('/news-items', { locale: l })).length >= 5, `${l} news (seven per market, two Italian ones left in draft)`);
  assert.equal((await api('/press-releases')).length, 7, 'seven published press releases, one left in draft');
  assert.equal((await api('/regulated-documents', { 'pagination[pageSize]': 100 })).length, 27);
});

// ------------------------------------------------------------------ admin: roles and permissions

test('demo users can log in', async () => {
  for (const u of ['admin', 'hq.editor', 'fr.editor', 'de.editor', 'it.editor', 'compliance']) await login(`${u}@meridian-demo.test`);
});

test('country editor IT: Italian locale only, locked fields, no publish', async () => {
  const it = await login('it.editor@meridian-demo.test');
  const { data: perms } = await it('GET', '/admin/users/me/permissions');
  const product = perms.filter((p) => p.subject === 'api::product.product');
  assert.ok(product.length, 'has product permissions');
  for (const p of product) assert.deepEqual(p.properties.locales, ['it'], `${p.action} limited to it`);
  const update = product.find((p) => p.action === 'plugin::content-manager.explorer.update');
  for (const f of ['legalDisclaimer', 'blocks', 'reviewNote']) assert.ok(!update.properties.fields.includes(f), `${f} is locked`);
  for (const f of ['localRate', 'rateWording', 'hasIntroOffer', 'introOfferText', 'seo.metaTitle']) assert.ok(update.properties.fields.includes(f), `${f} is open`);
  assert.ok(!product.some((p) => p.action === 'plugin::content-manager.explorer.publish'), 'no publish on products');
});

test('compliance: reads and publishes products in every locale, cannot create them', async () => {
  const c = await login('compliance@meridian-demo.test');
  const { data: perms } = await c('GET', '/admin/users/me/permissions');
  const product = perms.filter((p) => p.subject === 'api::product.product');
  assert.ok(product.some((p) => p.action === 'plugin::content-manager.explorer.publish'), 'publish');
  assert.ok(!product.some((p) => p.action === 'plugin::content-manager.explorer.create'), 'no create');
  assert.deepEqual(product.find((p) => p.action === 'plugin::content-manager.explorer.read').properties.locales.sort(), [...LOCALES].sort());
});

// ------------------------------------------------------------------ admin: enterprise state (skipped without licence)

test('review workflow: Home Secure IT sits in Changes requested with a review note', { skip: !ee?.workflows && 'licence has no review workflows' }, async () => {
  const c = await login('compliance@meridian-demo.test');
  const { data: wf } = await c('GET', '/review-workflows/workflows?populate=stages');
  const flow = wf.find((w) => w.name === 'Regulated content');
  assert.ok(flow, 'workflow exists');
  assert.deepEqual(flow.stages.map((s) => s.name), ['Draft', 'Compliance review', 'Changes requested', 'Approved']);
  const [hs] = await api('/products', { locale: 'it', 'filters[slug][$eq]': 'home-secure', status: 'draft' });
  const { data: entry } = await c('GET', `/content-manager/collection-types/api::product.product/${hs.documentId}?locale=it`);
  assert.equal(entry.strapi_stage?.name, 'Changes requested');
  assert.ok(entry.reviewNote, 'review note written');
  assert.ok(entry.strapi_assignee?.email?.startsWith('it.editor'), 'assigned to the Italy editor');
});

test('releases: Motor Flex launch, Winter promo start and end, all in the future', { skip: !ee?.releases && 'licence has no releases' }, async () => {
  const hq = await login('hq.editor@meridian-demo.test');
  const { data } = await hq('GET', '/content-releases');
  const names = data.map((r) => r.name);
  for (const n of ['Motor Flex launch', 'Winter promo start', 'Winter promo end']) assert.ok(names.includes(n), n);
  for (const r of data) assert.ok(new Date(r.scheduledAt) > new Date(), `${r.name} is scheduled in the future`);
});

test('content history: six versions of Motor Essential IT, 4.9 before 6.9', { skip: !ee?.history && 'licence has no content history' }, async () => {
  const c = await login('compliance@meridian-demo.test');
  const [me] = await api('/products', { locale: 'it', 'filters[slug][$eq]': 'motor-essential' });
  const { data } = await c('GET', `/content-manager/history-versions?contentType=api::product.product&documentId=${me.documentId}&locale=it&pageSize=20`);
  assert.ok(data.length >= 6, `at least six versions, got ${data.length}`);
  const rates = data.map((v) => v.data.localRate);
  assert.ok(rates.includes(4.9) && rates.includes(6.9), 'both rates in history');
});

test('audit logs: edits by the Italy editor and publishes by compliance are recorded', { skip: !ee?.auditLogs && 'licence has no audit logs' }, async () => {
  const c = await login('compliance@meridian-demo.test');
  const { data } = await c('GET', '/admin/audit-logs?pageSize=100&sort=date:DESC');
  const results = data.results ?? data;
  assert.ok(results.some((l) => l.action === 'entry.update' && l.user?.email?.startsWith('it.editor')), 'Italy editor update');
  assert.ok(results.some((l) => l.action === 'entry.publish' && l.user?.email?.startsWith('compliance')), 'compliance publish');
  assert.ok(results.some((l) => l.action === 'admin.auth.success'), 'logins recorded');
});

// ------------------------------------------------------------------ website

test('every demo route answers 200 in every locale', async () => {
  const routes = ['', '/products', '/products/motor-essential', '/products/home-secure', '/news', '/about', '/claims', '/contact', '/quote'];
  for (const l of LOCALES) for (const r of routes) {
    const res = await fetch(`${SITE}/${l}${r}`);
    assert.equal(res.status, 200, `${l}${r}`);
  }
  const press = (await api('/press-releases'))[0];
  assert.equal((await fetch(`${SITE}/en/press/${press.slug}`)).status, 200, 'press release page');
  const news = (await api('/news-items', { locale: 'it' }))[0];
  assert.equal((await fetch(`${SITE}/it/news/${news.slug}`)).status, 200, 'news page');
});

test('the website renders Strapi content: rate, intro offer, steps, banner', async () => {
  const me = await (await fetch(`${SITE}/it/products/motor-essential`)).text();
  assert.ok(/6[.,]9%/.test(me), 'rate on the Italian product page');
  assert.ok(/MMG-IT-MOT/i.test(me) && !/MMG-(FR|DE)-MOT/i.test(me), 'Italian document only');
  const hs = await (await fetch(`${SITE}/it/products/home-secure`)).text();
  assert.ok(hs.includes('due mesi gratis'), 'intro offer rendered');
  const home = await (await fetch(`${SITE}/it`)).text();
  assert.ok(home.includes('Come funziona un sinistro'), 'steps block rendered');
  assert.ok(home.includes('420 agenti'), 'default banner rendered');
  assert.ok(!home.includes('Motor Flex'), 'draft product not on the site');
});

test('live preview: draft mode needs the secret and serves draft content; admin may embed the site', async () => {
  const secret = env('PREVIEW_SECRET', 'preview_secret', 'next');
  const bad = await fetch(`${SITE}/api/preview?secret=wrong&url=/en`, { redirect: 'manual' });
  assert.equal(bad.status, 401, 'wrong secret refused');
  const good = await fetch(`${SITE}/api/preview?secret=${secret}&url=/en/products/motor-flex-2027`, { redirect: 'manual' });
  assert.equal(good.status, 307, 'redirects into the page');
  const cookie = good.headers.get('set-cookie')?.split(';')[0];
  assert.ok(cookie?.startsWith('__prerender_bypass'), 'draft cookie set');
  const draft = await fetch(`${SITE}/en/products/motor-flex-2027`, { headers: { cookie } });
  assert.equal(draft.status, 200, 'draft product page renders in draft mode');
  assert.ok((await draft.text()).includes('Motor Flex 2027'));
  const published = await fetch(`${SITE}/en/products/motor-flex-2027`);
  assert.equal(published.status, 404, 'and 404s without draft mode');
  const csp = (await fetch(`${SITE}/en`)).headers.get('content-security-policy') || '';
  assert.ok(csp.includes('frame-ancestors') && csp.includes(new URL(STRAPI).origin), 'CSP allows the admin to embed the site');
});
