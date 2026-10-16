// Offline checks on the seed dataset. Run any time: `yarn test:dataset`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { DATA, LOCALES, readJson } from './helpers.mjs';

const products = readJson('products.json');
const pages = readJson('pages.json');
const faqs = readJson('faqs.json');
const docs = readJson('regulated-documents.json');
const banners = readJson('promo-banners.json');
const news = readJson('news.json');
const press = readJson('press-releases.json');
const singles = readJson('single-types.json');
const media = new Set(fs.readdirSync(path.join(DATA, 'media')));

const localized = (items, name) => {
  for (const it of items) {
    for (const l of LOCALES) assert.ok(it.localizations?.[l], `${name} "${it.slug ?? it.key ?? it.name}" is missing locale ${l}`);
  }
};

test('counts match what the README promises', () => {
  assert.equal(products.length, 10);
  assert.equal(pages.length, 6);
  assert.equal(faqs.length, 20);
  assert.equal(banners.length, 4);
  assert.equal(news.length, 30);
  assert.equal(press.length, 8);
  assert.equal(docs.length, 27);
  assert.equal(media.size, 108);
});

test('every localised entry has all four languages (Motor Flex 2027 is English only on purpose)', () => {
  localized(products.filter((p) => p.slug !== 'motor-flex-2027'), 'product');
  assert.deepEqual(Object.keys(products.find((p) => p.slug === 'motor-flex-2027').localizations), ['en']);
  localized(pages, 'page');
  localized(faqs, 'faq');
  localized(banners, 'banner');
  for (const k of ['global', 'header', 'footer']) localized([singles[k]], k);
});

test('every media reference points to an existing file', () => {
  const refs = [];
  const walk = (v) => {
    if (typeof v === 'string' && /\.(jpg|png|pdf)$/.test(v)) refs.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  };
  [products, pages, faqs, docs, banners, news, press, singles].forEach(walk);
  const missing = refs.filter((r) => !media.has(r));
  assert.deepEqual(missing, [], `missing media: ${missing.join(', ')}`);
});

test('relations resolve: product documents, product and page FAQs, default banner', () => {
  const faqKeys = new Set(faqs.map((f) => f.key));
  const docKeys = new Set(docs.map((d) => d.product));
  for (const p of products) {
    for (const k of p.faqs || []) assert.ok(faqKeys.has(k), `product ${p.slug}: unknown FAQ ${k}`);
    for (const k of p.documents || []) assert.ok(docKeys.has(k), `product ${p.slug}: unknown document ${k}`);
  }
  for (const pg of pages) for (const k of pg.faqs || []) assert.ok(faqKeys.has(k), `page ${pg.slug}: unknown FAQ ${k}`);
  assert.ok(banners.some((b) => b.name === singles.global.defaultPromoBanner), 'global.defaultPromoBanner names an existing banner');
});

test('regulated documents: nine products, one per market, English plus the market language', () => {
  const byProduct = {};
  for (const d of docs) {
    (byProduct[d.product] ||= []).push(d.market);
    const langs = Object.keys(d.localizations);
    assert.ok(langs.includes('en'), `${d.product}/${d.market} has no English`);
    assert.ok(langs.includes(d.market.toLowerCase()), `${d.product}/${d.market} has no ${d.market} text`);
  }
  assert.equal(Object.keys(byProduct).length, 9);
  for (const [p, m] of Object.entries(byProduct)) assert.deepEqual([...m].sort(), ['DE', 'FR', 'IT'], `${p} markets`);
});

test('the deliberate demo details are in the data', () => {
  const me = products.find((p) => p.slug === 'motor-essential');
  assert.equal(me.localizations.it.localRate, 6.9, 'motor-essential IT ends at 6.9; the seed writes the 4.9 -> 6.9 history through the admin API');
  const hs = products.find((p) => p.slug === 'home-secure');
  for (const l of LOCALES) assert.equal(hs.localizations[l].hasIntroOffer, true, `home-secure ${l} intro offer`);
  for (const l of LOCALES) assert.ok(hs.localizations[l].introOfferText, `home-secure ${l} intro offer text`);
  const home = pages.find((p) => p.slug === 'home');
  for (const l of LOCALES) {
    const kinds = home.localizations[l].blocks.map((b) => b.__component);
    assert.ok(kinds.includes('blocks.steps'), `home ${l} has the steps block`);
    assert.ok(kinds.includes('blocks.hero'), `home ${l} has a hero`);
  }
  assert.ok(banners.some((b) => b.name === 'Winter cover check'), 'winter banner exists for the releases');
});

test('block components only use the ones the schema allows', () => {
  const allowed = new Set(JSON.parse(fs.readFileSync(path.join(DATA, '..', '..', 'src', 'api', 'page', 'content-types', 'page', 'schema.json'), 'utf8')).attributes.blocks.components);
  for (const set of [pages, products]) for (const it of set) for (const d of Object.values(it.localizations)) for (const b of d.blocks || []) assert.ok(allowed.has(b.__component), `${it.slug}: ${b.__component} not in the dynamic zone`);
});
