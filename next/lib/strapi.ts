import { draftMode } from 'next/headers';

import { API_URL } from './config';
export { API_URL, mediaUrl } from './config';

type Query = Record<string, string | number | boolean | undefined>;

async function isDraft() {
  try {
    const { isEnabled } = await draftMode();
    return isEnabled;
  } catch {
    return false;
  }
}

/**
 * Fetches from the Strapi content API. Default populate comes from the route
 * middlewares in strapi/src/api/* so pages only pass locale, filters and fields.
 * In draft mode (Live Preview) it asks for status=draft.
 */
export async function strapiFetch<T = any>(path: string, query: Query = {}): Promise<T> {
  const draft = await isDraft();
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) if (v !== undefined) params.set(k, String(v));
  params.set('status', draft ? 'draft' : 'published');
  const url = `${API_URL}/api${path}?${params.toString()}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Strapi ${res.status} on ${url}`);
  const json = await res.json();
  return json.data as T;
}

