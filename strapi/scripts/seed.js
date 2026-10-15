/**
 * Meridian Mutual Group demo seed.
 *
 * Fully automated, idempotent by construction: it wipes the SQLite database and the
 * uploads folder, boots Strapi in-process, then builds the whole demo state.
 *
 * Phase 1 (internal services): locales, media, content in four locales, public API
 * permissions, admin roles and users, review workflow, releases.
 * Phase 2 (admin HTTP API, logged in as each demo user): the actions that must carry a
 * real author, so that Content history and Audit logs show the right names:
 * the Italian rate change, the compliance rejection, the release creation, logins.
 *
 * Gated features (Review workflows, Releases, Content history, Audit logs) are only
 * seeded when the licence in STRAPI_LICENSE enables them. The script says what it skipped.
 *
 * Run:  yarn seed   (from strapi/ or from the repo root)
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'data', 'demo');
const MEDIA = path.join(DATA, 'media');
const LOCALES = ['en', 'fr', 'de', 'it'];
const LOCALE_NAMES = { fr: 'French (fr)', de: 'German (de)', it: 'Italian (it)' };
const PASSWORD = process.env.DEMO_PASSWORD || 'Meridian2026!';
const SNAPSHOT_DATE = new Date('2026-10-14T09:00:00Z');

const log = (...a) => console.log('[seed]', ...a);
const warn = (...a) => console.log('[seed] WARNING:', ...a);
const readJson = (f) => JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8'));

// ---------------------------------------------------------------------------- reset
function resetStorage() {
  const db = path.join(ROOT, '.tmp', 'data.db');
  for (const f of [db, `${db}-journal`, `${db}-wal`, `${db}-shm`]) {
    if (fs.existsSync(f)) fs.rmSync(f);
  }
  const uploads = path.join(ROOT, 'public', 'uploads');
  if (fs.existsSync(uploads)) {
    for (const f of fs.readdirSync(uploads)) {
      if (f !== '.gitkeep') fs.rmSync(path.join(uploads, f), { recursive: true, force: true });
    }
  }
  log('database and uploads wiped');
}

// ---------------------------------------------------------------------------- helpers
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.pdf': 'application/pdf' };

async function uploadFile(strapi, filename, alt, folder) {
  const filepath = path.join(MEDIA, filename);
  const stat = fs.statSync(filepath);
  const [file] = await strapi.plugin('upload').service('upload').upload({
    data: { fileInfo: { name: filename, alternativeText: alt || filename.replace(/[-_]/g, ' ').replace(/\.\w+$/, ''), caption: '', folder } },
    files: { filepath, originalFilename: filename, mimetype: MIME[path.extname(filename)] || 'application/octet-stream', size: stat.size },
  });
  return file;
}

async function createLocalized(strapi, uid, { base, localizations, status }, extra = {}) {
  // base: non-localised data; localizations: { en: {...}, fr: {...} }
  const locales = Object.keys(localizations);
  const first = locales.includes('en') ? 'en' : locales[0];
  const doc = await strapi.documents(uid).create({
    locale: first,
    status,
    data: { ...base, ...localizations[first], ...extra },
  });
  for (const l of locales.filter((x) => x !== first)) {
    await strapi.documents(uid).update({
      documentId: doc.documentId,
      locale: l,
      status,
      data: { ...base, ...localizations[l], ...extra },
    });
  }
  return doc;
}

function mapBlocks(blocks, media) {
  return (blocks || []).map((b) => {
    const out = { ...b };
    if (out.image && typeof out.image === 'string') out.image = media[out.image]?.id;
    return out;
  });
}

// ---------------------------------------------------------------------------- phase 1
async function seedLocales(strapi) {
  const svc = strapi.plugin('i18n').service('locales');
  const existing = (await svc.find()).map((l) => l.code);
  for (const code of ['fr', 'de', 'it']) {
    if (!existing.includes(code)) await svc.create({ code, name: LOCALE_NAMES[code] });
  }
  log('locales ready:', LOCALES.join(', '));
}

// Media library folders. Files are routed by name prefix.
const FOLDERS = [
  ['Products', null], ['Regulated documents', null], ['FR', 'Regulated documents'], ['DE', 'Regulated documents'], ['IT', 'Regulated documents'],
  ['Newsroom', null], ['News', 'Newsroom'], ['Press', 'Newsroom'], ['Brand', null], ['People', null], ['Offices', null],
];
function folderFor(filename) {
  if (filename.startsWith('product-')) return 'Products';
  if (filename.startsWith('doc-')) return filename.endsWith('-fr.pdf') ? 'FR' : filename.endsWith('-de.pdf') ? 'DE' : 'IT';
  if (filename.startsWith('news-')) return 'News';
  if (filename.startsWith('press-')) return 'Press';
  if (filename.startsWith('logo-') || filename.startsWith('brand-')) return 'Brand';
  if (filename.startsWith('photo-team-')) return 'People';
  if (filename.startsWith('photo-office-')) return 'Offices';
  return null;
}

async function seedMedia(strapi) {
  const folderService = strapi.plugin('upload').service('folder');
  const folders = {};
  for (const [name, parent] of FOLDERS) {
    folders[name] = await folderService.create({ name, parent: parent ? folders[parent].id : null });
  }
  const media = {};
  const files = fs.readdirSync(MEDIA).filter((f) => !f.startsWith('.'));
  for (const f of files) {
    const folder = folderFor(f);
    media[f] = await uploadFile(strapi, f, undefined, folder ? folders[folder].id : undefined);
  }
  log(`media uploaded: ${files.length} files into ${FOLDERS.length} folders`);
  return media;
}

async function seedContent(strapi, media) {
  const refs = { faqs: {}, docs: {}, products: {}, pages: {}, banners: {}, news: {}, press: {} };

  // FAQs
  for (const f of readJson('faqs.json')) {
    refs.faqs[f.key] = await createLocalized(strapi, 'api::faq.faq', {
      base: { category: f.category },
      localizations: f.localizations,
      status: 'published',
    });
  }
  log('faqs created');

  // Regulated documents
  for (const d of readJson('regulated-documents.json')) {
    const marketLocale = Object.keys(d.localizations).find((l) => l !== 'en') || 'en';
    refs.docs[d.key] = await strapi.documents('api::regulated-document.regulated-document').create({
      status: 'published',
      data: { title: d.localizations[marketLocale].title, market: d.market, validFrom: d.validFrom, validTo: d.validTo, regulatoryReference: d.regulatoryReference, file: media[d.file]?.id },
    });
  }
  log('regulated documents created');

  // Products
  for (const p of readJson('products.json')) {
    const isDraft = Boolean(p.demoState);
    const docIds = readJson('regulated-documents.json').filter((d) => p.documents.includes(d.product)).map((d) => refs.docs[d.key].documentId);
    const faqIds = p.faqs.map((k) => refs.faqs[k].documentId);
    const localizations = {};
    for (const [l, data] of Object.entries(p.localizations)) {
      localizations[l] = { ...data, blocks: mapBlocks(data.blocks, media) };
    }
    refs.products[p.slug] = await createLocalized(strapi, 'api::product.product', {
      base: { slug: p.slug, category: p.category, heroImage: media[p.heroImage]?.id, documents: docIds, faqs: faqIds },
      localizations,
      status: isDraft ? 'draft' : 'published',
    });
  }
  log('products created');

  // Pages
  for (const pg of readJson('pages.json')) {
    const localizations = {};
    for (const [l, data] of Object.entries(pg.localizations)) {
      localizations[l] = { ...data, blocks: mapBlocks(data.blocks, media) };
    }
    refs.pages[pg.slug] = await createLocalized(strapi, 'api::page.page', {
      base: { slug: pg.slug, faqs: pg.faqs.map((k) => refs.faqs[k].documentId) },
      localizations,
      status: 'published',
    });
  }
  log('pages created');

  // Promo banners
  for (const b of readJson('promo-banners.json')) {
    refs.banners[b.name] = await createLocalized(strapi, 'api::promo-banner.promo-banner', {
      base: { name: b.name, isDefault: b.isDefault },
      localizations: b.localizations,
      status: b.isDefault ? 'published' : 'draft',
    });
  }
  log('promo banners created');

  // News (one locale each) and press releases (en)
  for (const n of readJson('news.json')) {
    refs.news[n.slug] = await strapi.documents('api::news-item.news-item').create({
      locale: n.locale,
      status: n.demoState ? 'draft' : 'published',
      data: { title: n.title, slug: n.slug, excerpt: n.excerpt, body: n.body, cover: media[n.cover]?.id, market: n.market, publishedOn: n.publishedOn },
    });
  }
  for (const pr of readJson('press-releases.json')) {
    refs.press[pr.slug] = await strapi.documents('api::press-release.press-release').create({
      status: pr.demoState ? 'draft' : 'published',
      data: { title: pr.title, slug: pr.slug, body: pr.body, cover: media[pr.cover]?.id, publishedOn: pr.publishedOn },
    });
  }
  log('news and press releases created');

  // Single types
  const st = readJson('single-types.json');
  const defaultBanner = refs.banners[st.global.defaultPromoBanner];
  await createLocalized(strapi, 'api::global.global', {
    base: { siteName: st.global.siteName, logo: media[st.global.logo]?.id, defaultPromoBanner: defaultBanner.documentId },
    localizations: st.global.localizations,
    status: 'published',
  });
  await createLocalized(strapi, 'api::header.header', { base: {}, localizations: st.header.localizations, status: 'published' });
  await createLocalized(strapi, 'api::footer.footer', { base: {}, localizations: st.footer.localizations, status: 'published' });
  log('global, header and footer created');
  return refs;
}

async function seedPublicPermissions(strapi) {
  const role = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
  const actions = [];
  for (const uid of Object.keys(strapi.contentTypes).filter((k) => k.startsWith('api::'))) {
    const isSingle = strapi.contentTypes[uid].kind === 'singleType';
    actions.push(`${uid}.find`);
    if (!isSingle) actions.push(`${uid}.findOne`);
  }
  for (const action of actions) {
    const exists = await strapi.db.query('plugin::users-permissions.permission').findOne({ where: { action, role: role.id } });
    if (!exists) await strapi.db.query('plugin::users-permissions.permission').create({ data: { action, role: role.id } });
  }
  log(`public API permissions granted: ${actions.length} actions (find/findOne on every content type)`);
}

// ---------------------------------------------------------------------------- admin roles and users
const CM = 'plugin::content-manager.explorer';
const ALL_CT = ['api::product.product', 'api::page.page', 'api::news-item.news-item', 'api::press-release.press-release', 'api::regulated-document.regulated-document', 'api::promo-banner.promo-banner', 'api::faq.faq', 'api::global.global', 'api::header.header', 'api::footer.footer'];
const COUNTRY_CT = ['api::product.product', 'api::page.page', 'api::news-item.news-item', 'api::regulated-document.regulated-document', 'api::faq.faq'];
const LOCKED = { 'api::product.product': ['legalDisclaimer', 'blocks', 'reviewNote'], 'api::regulated-document.regulated-document': ['regulatoryReference'] };

function fieldsFor(strapi, uid, exclude = []) {
  const all = strapi.service('admin::content-type').getNestedFields(strapi.contentTypes[uid], { components: strapi.components });
  return all.filter((f) => !exclude.some((x) => f === x || f.startsWith(`${x}.`)));
}

function cmPermissions(strapi, uids, { actions, locales, locked = {} }) {
  const perms = [];
  for (const uid of uids) {
    for (const action of actions) {
      const fields = action === 'delete' || action === 'publish' ? undefined : fieldsFor(strapi, uid, action === 'read' ? [] : locked[uid] || []);
      perms.push({ action: `${CM}.${action}`, subject: uid, properties: { fields, locales }, conditions: [] });
    }
  }
  return perms;
}

const SETTINGS = {
  upload: [
    { action: 'plugin::upload.read' }, { action: 'plugin::upload.assets.create' }, { action: 'plugin::upload.assets.update' }, { action: 'plugin::upload.assets.download' }, { action: 'plugin::upload.assets.copy-link' },
  ],
  releases: [{ action: 'plugin::content-releases.read' }, { action: 'plugin::content-releases.create' }, { action: 'plugin::content-releases.update' }, { action: 'plugin::content-releases.delete' }, { action: 'plugin::content-releases.create-action' }, { action: 'plugin::content-releases.delete-action' }, { action: 'plugin::content-releases.publish' }],
  auditRead: [{ action: 'admin::audit-logs.read' }],
  workflowsRead: [{ action: 'admin::review-workflows.read' }],
};

async function seedAdmin(strapi, features) {
  const roleService = strapi.service('admin::role');
  const userService = strapi.service('admin::user');
  const superAdmin = await roleService.getSuperAdmin();

  const withGated = (perms) => perms.filter((p) => {
    if (p.action.startsWith('plugin::content-releases') && !features.releases) return false;
    if (p.action.startsWith('admin::audit-logs') && !features.auditLogs) return false;
    if (p.action.startsWith('admin::review-workflows') && !features.workflows) return false;
    return true;
  });

  const roles = {};
  const create = async (name, description, perms) => {
    const role = await roleService.create({ name, description });
    await roleService.assignPermissions(role.id, withGated(perms).map((p) => ({ conditions: [], properties: {}, ...p })));
    roles[name] = role;
    return role;
  };

  await create('HQ editor', 'Headquarters content team: owns templates, group content and launches. Can publish non-regulated content.', [
    ...cmPermissions(strapi, ALL_CT, { actions: ['create', 'read', 'update', 'delete'], locales: LOCALES }),
    ...cmPermissions(strapi, ['api::page.page', 'api::news-item.news-item', 'api::press-release.press-release', 'api::promo-banner.promo-banner', 'api::faq.faq', 'api::global.global', 'api::header.header', 'api::footer.footer'], { actions: ['publish'], locales: LOCALES }),
    ...SETTINGS.upload, ...SETTINGS.releases,
  ]);
  for (const [code, label] of [['fr', 'FR'], ['de', 'DE'], ['it', 'IT']]) {
    await create(`Country editor ${label}`, `${label} country team: edits its own locale only. Legal wording and page structure are read-only. Cannot publish.`, [
      ...cmPermissions(strapi, COUNTRY_CT, { actions: ['create', 'read', 'update'], locales: [code], locked: LOCKED }),
      ...SETTINGS.upload,
    ]);
  }
  await create('Compliance reviewer', 'Compliance and legal: reviews regulated content, approves or sends back, publishes products and documents.', [
    ...cmPermissions(strapi, ['api::product.product', 'api::regulated-document.regulated-document'], { actions: ['read', 'update', 'publish'], locales: LOCALES }),
    ...cmPermissions(strapi, ['api::page.page', 'api::news-item.news-item', 'api::press-release.press-release', 'api::promo-banner.promo-banner', 'api::faq.faq'], { actions: ['read'], locales: LOCALES }),
    ...SETTINGS.upload, ...SETTINGS.auditRead, ...SETTINGS.workflowsRead,
  ]);

  const users = [
    { email: 'admin@meridian-demo.test', firstname: 'Platform', lastname: 'Admin', roles: [superAdmin.id] },
    { email: 'hq.editor@meridian-demo.test', firstname: 'HQ', lastname: 'Editor', roles: [roles['HQ editor'].id] },
    { email: 'fr.editor@meridian-demo.test', firstname: 'France', lastname: 'Editor', roles: [roles['Country editor FR'].id] },
    { email: 'de.editor@meridian-demo.test', firstname: 'Germany', lastname: 'Editor', roles: [roles['Country editor DE'].id] },
    { email: 'it.editor@meridian-demo.test', firstname: 'Italy', lastname: 'Editor', roles: [roles['Country editor IT'].id] },
    { email: 'compliance@meridian-demo.test', firstname: 'Compliance', lastname: 'Reviewer', roles: [roles['Compliance reviewer'].id] },
  ];
  const created = {};
  for (const u of users) {
    created[u.email] = await userService.create({ ...u, password: PASSWORD, isActive: true });
  }
  log(`admin roles created: ${Object.keys(roles).length}, users: ${users.length} (password: ${PASSWORD})`);
  return { roles, users: created };
}

// ---------------------------------------------------------------------------- workflow (gated)
async function seedWorkflow(strapi, roles) {
  const transition = 'admin::review-workflows.stage.transition';
  const countryRoles = ['Country editor FR', 'Country editor DE', 'Country editor IT'].map((n) => roles[n].id);
  const compliance = roles['Compliance reviewer'].id;
  const hq = roles['HQ editor'].id;
  const perm = (ids) => ids.map((role) => ({ role, action: transition }));
  const everyone = [...countryRoles, hq, compliance];
  const workflow = await strapi.plugin('review-workflows').service('workflows').create({
    data: {
      name: 'Regulated content',
      contentTypes: ['api::product.product', 'api::regulated-document.regulated-document'],
      stageRequiredToPublishName: 'Approved',
      // fromPermissions = roles allowed to move an entry OUT of a stage; toPermissions = roles allowed
      // to move an entry INTO it. Strapi checks both. The controls that matter for the demo:
      // only compliance can move an entry out of "Compliance review", and only compliance can put
      // an entry into "Changes requested" or "Approved". Editors send drafts, rejected and already
      // approved entries back into review.
      stages: [
        { name: 'Draft', color: '#4945FF', fromPermissions: perm(everyone), toPermissions: perm(everyone) },
        { name: 'Compliance review', color: '#D9822F', fromPermissions: perm([compliance]), toPermissions: perm(everyone) },
        { name: 'Changes requested', color: '#D02B20', fromPermissions: perm(everyone), toPermissions: perm([compliance]) },
        { name: 'Approved', color: '#328048', fromPermissions: perm(everyone), toPermissions: perm([compliance]) },
      ],
    },
  });
  const stages = await strapi.plugin('review-workflows').service('stages').find({ workflowId: workflow.id });
  const byName = Object.fromEntries(stages.map((s) => [s.name, s]));
  // Documents that are published start in Approved (both their draft and published rows); drafts stay in Draft
  for (const uid of ['api::product.product', 'api::regulated-document.regulated-document']) {
    const entries = await strapi.db.query(uid).findMany({ select: ['id', 'documentId', 'locale', 'updatedAt', 'publishedAt'] });
    const publishedDocs = new Set(entries.filter((e) => e.publishedAt).map((e) => `${e.documentId}:${e.locale}`));
    for (const e of entries) {
      if (publishedDocs.has(`${e.documentId}:${e.locale}`)) {
        await strapi.plugin('review-workflows').service('stages').updateEntity(e, uid, byName['Approved'].id);
      }
    }
  }
  log('review workflow "Regulated content" created with 4 stages, required stage Approved');
  return byName;
}

// ---------------------------------------------------------------------------- phase 2: attributed activity over the admin API
async function adminApi(strapi) {
  const base = `http://127.0.0.1:${strapi.config.get('server.port')}`;
  const login = async (email) => {
    const r = await fetch(`${base}/admin/login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password: PASSWORD }) });
    if (!r.ok) throw new Error(`login failed for ${email}: ${r.status} ${await r.text()}`);
    const { data } = await r.json();
    const token = data.token;
    const call = async (method, p, body) => {
      const res = await fetch(`${base}${p}`, { method, headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` }, body: body ? JSON.stringify(body) : undefined });
      const text = await res.text();
      if (!res.ok) throw new Error(`${method} ${p} -> ${res.status} ${text.slice(0, 300)}`);
      return text ? JSON.parse(text) : null;
    };
    return { call, email };
  };
  return { login };
}

async function seedActivity(strapi, refs, features, stages, users) {
  const api = await adminApi(strapi);
  const product = 'api::product.product';
  const cm = (uid, documentId, locale) => `/content-manager/collection-types/${uid}/${documentId}?locale=${locale}`;

  // Logins for every user: audit log gets admin.auth.success for each
  const sessions = {};
  for (const email of Object.keys(users)) sessions[email] = await api.login(email);
  const failures = [];

  // SSO options (gated): auto-register with the lowest useful role, local login for super admins only.
  if (features.sso) {
    try {
      const admin = sessions['admin@meridian-demo.test'];
      const roles = await strapi.service('admin::role').find();
      const byName = Object.fromEntries(roles.map((r) => [r.name, r]));
      const locked = roles.filter((r) => r.code !== 'strapi-super-admin').map((r) => r.id);
      await admin.call('PUT', '/admin/providers/options', { autoRegister: true, defaultRole: byName['HQ editor'].id, ssoLockedRoles: locked });
      log(`SSO options set: auto-register as HQ editor, local login locked for ${locked.length} roles (super admins keep it)${process.env.GOOGLE_CLIENT_ID ? ', Google provider active' : ', no provider configured (set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env)'}`);
    } catch (e) { failures.push(`SSO options: ${e.message}`); }
  }

  const it = sessions['it.editor@meridian-demo.test'];
  const fr = sessions['fr.editor@meridian-demo.test'];
  const de = sessions['de.editor@meridian-demo.test'];
  const hq = sessions['hq.editor@meridian-demo.test'];
  const compliance = sessions['compliance@meridian-demo.test'];
  const publish = (uid, documentId, locale) => `/content-manager/collection-types/${uid}/${documentId}/actions/publish${locale ? `?locale=${locale}` : ''}`;

  // Two weeks of ordinary editing across the teams, so Content history and the Audit log look lived in.
  // Each country editor touches a few products in its own locale; compliance publishes. HQ edits pages and news.
  const touches = [
    [fr, 'home-secure', 'fr', { tagline: 'Bâtiment et contenu, pour le logement où vous vivez vraiment. Dégâts des eaux inclus.' }],
    [fr, 'health-plus', 'fr', { tagline: 'Une complémentaire santé qui complète votre régime obligatoire, sans délai pour les accidents.' }],
    [fr, 'savings-plan', 'fr', { localRate: 2.5, rateWording: 'Taux annuel garanti de 2,5 % brut pour 2026, révisé chaque janvier. Capital garanti à tout moment.' }],
    [de, 'motor-essential', 'de', { tagline: 'Haftpflichtschutz, der Sie legal und mobil hält. Pannenhilfe bis 50 km.' }],
    [de, 'life-horizon', 'de', { tagline: 'Risikolebensversicherung für die Menschen, die auf Sie zählen. Ohne Gesundheitsprüfung für die meisten.' }],
    [de, 'travel-go', 'de', { tagline: 'Krankheit, Storno und Gepäck, weltweit, für eine Reise oder das ganze Jahr.' }],
    [it, 'health-plus', 'it', { tagline: 'Una copertura sanitaria integrativa che completa il servizio nazionale. Infortuni coperti dal primo giorno.' }],
    [it, 'pet-care', 'it', { tagline: 'Le spese veterinarie di cani e gatti, senza sorprese. Linea veterinaria 24 ore.' }],
    [it, 'savings-plan', 'it', { tagline: 'Un piano a tasso garantito per i soldi che vuoi tenere tranquilli. Da 25 EUR al mese.' }],
  ];
  for (const [session, slug, locale, data] of touches) {
    const id = refs.products[slug].documentId;
    await session.call('PUT', cm(product, id, locale), data);
    await compliance.call('POST', publish(product, id, locale), {});
  }
  const page = 'api::page.page';
  const home = refs.pages['home'].documentId;
  const homeEn = await hq.call('GET', `${cm(page, home, 'en')}`);
  const homeBlocks = homeEn?.data?.blocks;
  if (Array.isArray(homeBlocks) && homeBlocks[0]?.__component === 'blocks.hero') {
    const b = JSON.parse(JSON.stringify(homeBlocks));
    b[0].subtitle = 'Motor, home, health, life and savings for 2.1 million people in France, Germany and Italy. Plain terms, real agents, claims paid in nine days on average.';
    await hq.call('PUT', cm(page, home, 'en'), { blocks: b });
    await hq.call('POST', publish(page, home, 'en'), {});
  }
  const newsUid = 'api::news-item.news-item';
  const n1 = refs.news['group-results-h1-2026'];
  if (n1) {
    await hq.call('PUT', cm(newsUid, n1.documentId, 'en'), { excerpt: 'Membership grew 3.4% and the average claim is now settled in nine days, from twelve a year ago. Solvency at 212%.' });
    await hq.call('POST', publish(newsUid, n1.documentId, 'en'), {});
  }
  log('two weeks of ordinary editing recorded: 9 product edits by country teams, 1 page and 1 news edit by HQ, all published by compliance or HQ');

  // Rate history: Italy editor changes the Motor Essential rate step by step, ending at 6.9, compliance publishes each time.
  const motor = refs.products['motor-essential'].documentId;
  await it.call('PUT', cm(product, motor, 'it'), { tagline: 'La copertura RC che ti tiene in regola e in strada, con assistenza entro 50 km.' });
  await compliance.call('POST', publish(product, motor, 'it'), {});
  await it.call('PUT', cm(product, motor, 'it'), { localRate: 4.9, rateWording: 'TAEG 4,9% per pagamento mensile. Premio annuo da 325 EUR.' });
  await compliance.call('POST', publish(product, motor, 'it'), {});
  await it.call('PUT', cm(product, motor, 'it'), { localRate: 6.9, rateWording: 'TAEG 6,9% per pagamento mensile. Premio annuo da 325 EUR.' });
  await compliance.call('POST', publish(product, motor, 'it'), {});
  log('rate history created: motor-essential (it) rate 4.9 -> 6.9, six versions in history, published');

  // Review state: Home Secure (it) sent to review by Italy, sent back by compliance with a note
  if (features.workflows && stages) try {
    const home = refs.products['home-secure'].documentId;
    const stagePath = (documentId, locale) => `/review-workflows/content-manager/collection-types/${product}/${documentId}/stage?locale=${locale}`;
    const assigneePath = (documentId, locale) => `/review-workflows/content-manager/collection-types/${product}/${documentId}/assignee?locale=${locale}`;
    await it.call('PUT', cm(product, home, 'it'), { tagline: 'Fabbricato e contenuto, per la casa in cui vivi davvero. Ora con copertura giardino inclusa.' });
    await it.call('PUT', stagePath(home, 'it'), { data: { id: stages['Compliance review'].id } });
    await it.call('PUT', assigneePath(home, 'it'), { data: { id: users['compliance@meridian-demo.test'].id } });
    await compliance.call('PUT', cm(product, home, 'it'), { reviewNote: 'Premium wording must state the annual amount before the monthly one. Garden cover is an optional add-on, not included: fix the tagline.' });
    await compliance.call('PUT', stagePath(home, 'it'), { data: { id: stages['Changes requested'].id } });
    await compliance.call('PUT', assigneePath(home, 'it'), { data: { id: users['it.editor@meridian-demo.test'].id } });
    log('review state created: home-secure (it) in Changes requested with a review note');
  } catch (e) { failures.push(`review state: ${e.message}`); }

  // Releases, created by the HQ editor so they carry an author
  if (features.releases) try {
    const hq = sessions['hq.editor@meridian-demo.test'];
    const inDays = (n, hour) => { const d = new Date(); d.setUTCDate(d.getUTCDate() + n); d.setUTCHours(hour, 0, 0, 0); return d.toISOString(); };
    const release = async (name, scheduledAt) => (await hq.call('POST', '/content-releases', { name, scheduledAt, timezone: 'Europe/Paris' })).data;
    const addAction = (releaseId, entryDocumentId, contentType, locale, type) =>
      hq.call('POST', `/content-releases/${releaseId}/actions`, { entryDocumentId, contentType, ...(locale ? { locale } : {}), type });
    // Dates are relative to the seed date so the seed never fails on "scheduled in the past"
    const launch = await release('Motor Flex launch', inDays(19, 8));
    const winterStart = await release('Winter promo start', inDays(47, 6));
    const winterEnd = await release('Winter promo end', inDays(92, 6));
    const winter = refs.banners['Winter cover check'].documentId;
    for (const l of LOCALES) {
      await addAction(winterStart.id, winter, 'api::promo-banner.promo-banner', l, 'publish');
      await addAction(winterEnd.id, winter, 'api::promo-banner.promo-banner', l, 'unpublish');
    }
    await addAction(launch.id, refs.press['motor-flex-2027-announcement'].documentId, 'api::press-release.press-release', null, 'publish');
    const teaser = refs.banners['Motor Flex 2027 teaser'];
    if (teaser) for (const l of LOCALES) await addAction(launch.id, teaser.documentId, 'api::promo-banner.promo-banner', l, 'publish');
    log('releases created: Motor Flex launch (press release and teaser banner inside), Winter promo start and end');
  } catch (e) { failures.push(`releases: ${e.message}`); }
  return failures;
}

// ---------------------------------------------------------------------------- main
async function main() {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  resetStorage();
  const { createStrapi, compileStrapi } = require('@strapi/strapi');
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).start();
  const strapi = app;
  try {
    const features = {
      workflows: strapi.ee.features.isEnabled('review-workflows'),
      releases: strapi.ee.features.isEnabled('cms-content-releases'),
      auditLogs: strapi.ee.features.isEnabled('audit-logs'),
      history: strapi.ee.features.isEnabled('cms-content-history'),
      sso: strapi.ee.features.isEnabled('sso'),
    };
    log('licence features:', JSON.stringify(features));
    for (const [k, v] of Object.entries(features)) {
      if (!v) warn(`${k} is not enabled by the licence in STRAPI_LICENSE; the related demo state is skipped.`);
    }

    await seedLocales(strapi);
    const media = await seedMedia(strapi);
    const refs = await seedContent(strapi, media);
    await seedPublicPermissions(strapi);
    const { roles, users } = await seedAdmin(strapi, features);
    const stages = features.workflows ? await seedWorkflow(strapi, roles) : null;
    const failures = await seedActivity(strapi, refs, features, stages, users);
    for (const f of failures) warn(`${f}. The rest of the demo state is in place; send this message to whoever maintains the seed.`);

    log(failures.length ? `done with ${failures.length} warning(s). Admin: http://localhost:1337/admin` : 'done. Admin: http://localhost:1337/admin');
    log(`log in as admin@meridian-demo.test / ${PASSWORD} (or any demo user, same password)`);
  } finally {
    await app.destroy();
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error('[seed] FAILED', e); process.exit(1); });
