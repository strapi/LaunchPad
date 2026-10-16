import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const DATA = path.join(ROOT, 'strapi', 'data', 'demo');
export const LOCALES = ['en', 'fr', 'de', 'it'];

export const readJson = (file) => JSON.parse(fs.readFileSync(path.join(DATA, file), 'utf8'));

/** Minimal .env reader: process.env wins, then strapi/.env, then the default. */
export function env(name, fallback, app = 'strapi') {
  if (process.env[name]) return process.env[name];
  const file = path.join(ROOT, app, '.env');
  if (fs.existsSync(file)) {
    const m = fs.readFileSync(file, 'utf8').match(new RegExp(`^${name}=(.*)$`, 'm'));
    if (m && m[1].trim()) return m[1].trim().replace(/^["']|["']$/g, '');
  }
  return fallback;
}

export const STRAPI = env('STRAPI_URL', 'http://localhost:1337');
export const SITE = env('SITE_URL', 'http://localhost:3000');
export const PASSWORD = env('DEMO_PASSWORD', 'Meridian2026!');

export async function api(p, params = {}) {
  const url = new URL(`/api${p}`, STRAPI);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const r = await fetch(url);
  if (!r.ok) throw new Error(`GET ${url} -> ${r.status}`);
  return (await r.json()).data;
}

const sessions = new Map();

/** One admin session per user for the whole run: the admin login endpoint is rate limited (429 after a burst). */
export async function login(email) {
  if (sessions.has(email)) return sessions.get(email);
  const r = await fetch(`${STRAPI}/admin/login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password: PASSWORD }) });
  if (!r.ok) throw new Error(`login ${email} -> ${r.status}`);
  const token = (await r.json()).data.token;
  const call = async (method, p, body) => {
    const res = await fetch(`${STRAPI}${p}`, { method, headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` }, body: body ? JSON.stringify(body) : undefined });
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch {}
    return { status: res.status, ok: res.ok, data: json?.data ?? json, error: json?.error };
  };
  sessions.set(email, call);
  return call;
}

/** Which Enterprise features the running instance has. */
export async function features() {
  const r = await fetch(`${STRAPI}/admin/project-type`);
  const { data } = await r.json();
  const list = data.features || [];
  const has = (name) => list.some((f) => (typeof f === 'string' ? f : f.name) === name);
  return { workflows: has('review-workflows'), releases: has('cms-content-releases'), auditLogs: has('audit-logs'), history: has('cms-content-history'), sso: has('sso') };
}

export async function reachable(url) {
  try { const r = await fetch(url); return r.status < 500; } catch { return false; }
}
