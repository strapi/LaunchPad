import fs from 'fs/promises';
import matter from 'gray-matter';
import path from 'path';

const ROOT = process.argv[2] ?? './peter-sung_content_design_patch';
const PUBLISH = process.argv.includes('--publish');
const STRAPI_URL = process.env.STRAPI_URL ?? 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

if (!STRAPI_TOKEN) {
  console.error('Missing STRAPI_TOKEN');
  process.exit(1);
}

const H = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${STRAPI_TOKEN}`,
};

const q = (o) => new URLSearchParams(o).toString();
const api = (p) => `${STRAPI_URL}${p}`;

const normalizeSlug = (s) => {
  if (!s || s === '/') return 'home';
  return s.replace(/^\//, '');
};

async function getBySlug(slug) {
  const url = api(
    `/api/pages?${q({
      'filters[slug][$eq]': slug,
      publicationState: 'preview',
      'pagination[pageSize]': '1',
    })}`
  );
  const res = await fetch(url, { headers: H });
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  const json = await res.json();
  return json.data?.[0] ?? null;
}

async function createPage(payload) {
  const res = await fetch(api('/api/pages'), {
    method: 'POST',
    headers: H,
    body: JSON.stringify({ data: payload }),
  });
  if (!res.ok)
    throw new Error(`POST /api/pages -> ${res.status} ${await res.text()}`);
  return res.json();
}

async function updatePage(id, payload) {
  const res = await fetch(api(`/api/pages/${id}`), {
    method: 'PUT',
    headers: H,
    body: JSON.stringify({ data: payload }),
  });
  if (!res.ok)
    throw new Error(
      `PUT /api/pages/${id} -> ${res.status} ${await res.text()}`
    );
  return res.json();
}

function toPayload({ title, slug, description, body }) {
  const payload = {
    title,
    slug: normalizeSlug(slug),
    body,
    seo: { title, description },
  };
  if (PUBLISH) payload.publishedAt = new Date().toISOString();
  return payload;
}

async function ingestSeed(seedPath) {
  const raw = await fs.readFile(seedPath, 'utf-8');
  const seed = JSON.parse(raw);
  for (const p of seed.pages) {
    const payload = toPayload({
      title: p.title,
      slug: p.slug,
      description: p.seo?.description ?? '',
      body: p.body,
    });
    const existing = await getBySlug(payload.slug);
    if (existing) await updatePage(existing.id, payload);
    else await createPage(payload);
    console.log(`upserted: ${payload.slug}`);
  }
}

async function ingestMarkdown(mdDir) {
  const files = (await fs.readdir(mdDir)).filter((f) => f.endsWith('.md'));
  for (const f of files) {
    const full = path.join(mdDir, f);
    const src = await fs.readFile(full, 'utf-8');
    const { data, content } = matter(src);
    const payload = toPayload({
      title: data.title ?? path.basename(f, '.md'),
      slug: data.slug ?? data.sourceURL ?? path.basename(f, '.md'),
      description: data.description ?? '',
      body: content.trim(),
    });
    const existing = await getBySlug(payload.slug);
    if (existing) await updatePage(existing.id, payload);
    else await createPage(payload);
    console.log(`upserted: ${payload.slug} (${f})`);
  }
}

async function main() {
  const seed = path.join(ROOT, 'strapi_seed', 'pages.seed.json');
  const mdDir = path.join(ROOT, 'content', '_imports', 'securebase');
  try {
    await fs.access(seed);
    await ingestSeed(seed);
  } catch {
    /* seed optional */
  }
  await ingestMarkdown(mdDir);
  console.log('done');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
