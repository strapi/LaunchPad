import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import TurndownService from 'turndown';
import pLimit from 'p-limit';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://securebase.cc';
const OUTPUT_DIR = path.join(__dirname, '../content/_imports/securebase');
const IMAGES_DIR = path.join(OUTPUT_DIR, 'images');
const RAW_DIR = path.join(OUTPUT_DIR, 'raw');
const LOGS_DIR = path.join(OUTPUT_DIR, 'logs');

const SEED_URLS = [
  '/',
  '/about',
  '/speaking',
  '/coaching',
  '/contact'
];

const limit = pLimit(2); // Limit concurrency

// Ensure directories exist
async function ensureDirs() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.mkdir(IMAGES_DIR, { recursive: true });
  await fs.mkdir(RAW_DIR, { recursive: true });
  await fs.mkdir(LOGS_DIR, { recursive: true });
}

// Helper to normalize URL
function normalizeUrl(url) {
  try {
    const u = new URL(url, BASE_URL);
    return u.href;
  } catch (e) {
    return null;
  }
}

// Helper to get slug from URL
function getSlug(url) {
  const u = new URL(url);
  const pathname = u.pathname;
  if (pathname === '/' || pathname === '') return 'index';
  return pathname.replace(/^\/|\/$/g, '').replace(/\//g, '-');
}

// Turndown service setup
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
});

// Custom turndown rules can be added here

async function downloadImage(url, referer) {
  try {
    const absoluteUrl = new URL(url, BASE_URL).href;
    const filename = path.basename(new URL(absoluteUrl).pathname);
    // Simple validation to avoid weird filenames
    if (!filename || filename.length > 100) return null;

    const filepath = path.join(IMAGES_DIR, filename);
    
    // Check if already exists
    try {
      await fs.access(filepath);
      return filename;
    } catch {}

    const res = await fetch(absoluteUrl, {
      headers: { 'Referer': referer }
    });

    if (!res.ok) return null;

    const buffer = await res.arrayBuffer();
    await fs.writeFile(filepath, Buffer.from(buffer));
    return filename;
  } catch (e) {
    console.error(`Failed to download image ${url}:`, e.message);
    return null;
  }
}

async function processPage(url) {
  console.log(`Processing ${url}...`);
  const slug = getSlug(url);
  const rawPath = path.join(RAW_DIR, `${slug}.html`);
  const mdPath = path.join(OUTPUT_DIR, `${slug}.md`);

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
      return { url, status: res.status, error: res.statusText };
    }

    const html = await res.text();
    await fs.writeFile(rawPath, html);

    const dom = new JSDOM(html, { url });
    const doc = dom.window.document;

    const title = doc.querySelector('title')?.textContent || '';
    const description = doc.querySelector('meta[name="description"]')?.content || '';
    
    // Extract main content - adjust selector based on actual site structure
    // Fallback to body if main not found
    const contentEl = doc.querySelector('main') || doc.querySelector('article') || doc.body;
    
    // Handle images before converting to markdown
    const images = [];
    const imgEls = contentEl.querySelectorAll('img');
    for (const img of imgEls) {
      const src = img.getAttribute('src');
      if (src) {
        const filename = await downloadImage(src, url);
        if (filename) {
          img.setAttribute('src', `./images/${filename}`);
          images.push({ src: src, local: filename, alt: img.alt });
        }
      }
    }

    const markdown = turndownService.turndown(contentEl.innerHTML);

    const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
description: "${description.replace(/"/g, '\\"')}"
slug: "${slug}"
sourceURL: "${url}"
lastFetched: "${new Date().toISOString()}"
---

`;

    await fs.writeFile(mdPath, frontmatter + markdown);
    console.log(`Saved ${mdPath}`);

    return { url, status: 200, slug };

  } catch (e) {
    console.error(`Error processing ${url}:`, e);
    return { url, status: 500, error: e.message };
  }
}

async function main() {
  await ensureDirs();
  
  const results = [];
  const queue = SEED_URLS.map(path => normalizeUrl(path));

  // Simple crawl - just the seed URLs for now as per spec
  // If recursive discovery is needed, we'd add to queue here
  
  const tasks = queue.map(url => limit(() => processPage(url)));
  const crawlResults = await Promise.all(tasks);

  // Generate Sitemap
  const sitemap = {
    generatedAt: new Date().toISOString(),
    source: BASE_URL,
    pages: crawlResults.filter(r => r.status === 200)
  };

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'SITEMAP.json'), 
    JSON.stringify(sitemap, null, 2)
  );
  
  console.log('Crawl complete.');
}

main().catch(console.error);
