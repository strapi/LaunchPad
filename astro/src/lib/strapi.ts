/**
 * Strapi access for the Astro client.
 *
 * LaunchPad's backend registers a populate middleware on every API route, so
 * callers never pass `populate` — the server decides what a full entry looks
 * like. That keeps this layer thin: pick the collection, pass locale and any
 * filters, get a fully-populated entry back.
 *
 * Two modes:
 *   - published (default) — used at build time to prerender the public site
 *   - draft — used per request behind `/api/preview`, and additionally asks
 *     Strapi to embed content source maps so the admin's preview overlay can
 *     map rendered elements back to their fields
 */

export const STRAPI_URL =
  import.meta.env.STRAPI_URL ??
  process.env.STRAPI_URL ??
  'http://localhost:1337';

const API_URL = `${STRAPI_URL}/api`;

export interface FetchOptions {
  locale?: string;
  filters?: Record<string, unknown>;
  sort?: string | string[];
  pagination?: { page?: number; pageSize?: number };
  /** Fetch drafts instead of published entries, and request source maps. */
  draft?: boolean;
}

/**
 * Serialises nested objects into Strapi's bracket query syntax
 * (`filters[slug][$eq]=foo`) without pulling in `qs`.
 */
function toQuery(value: unknown, prefix = ''): string[] {
  if (value === undefined || value === null) return [];

  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      toQuery(item, prefix ? `${prefix}[${index}]` : String(index))
    );
  }

  if (typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).flatMap(
      ([key, val]) => toQuery(val, prefix ? `${prefix}[${key}]` : key)
    );
  }

  return [`${encodeURIComponent(prefix)}=${encodeURIComponent(String(value))}`];
}

function buildQuery(options: FetchOptions): string {
  const parts: string[] = [];

  if (options.locale)
    parts.push(`locale=${encodeURIComponent(options.locale)}`);
  if (options.draft) parts.push('status=draft');
  if (options.filters) parts.push(...toQuery(options.filters, 'filters'));
  if (options.sort) parts.push(...toQuery(options.sort, 'sort'));
  if (options.pagination)
    parts.push(...toQuery(options.pagination, 'pagination'));

  return parts.length ? `?${parts.join('&')}` : '';
}

export class StrapiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly path: string
  ) {
    super(message);
    this.name = 'StrapiError';
  }
}

async function request<T>(path: string, options: FetchOptions): Promise<T> {
  const url = `${API_URL}/${path}${buildQuery(options)}`;

  const response = await fetch(url, {
    headers: {
      // Only meaningful in draft mode: tells Strapi to embed invisible stega
      // markers so its preview overlay can locate each field in the DOM.
      // See `src/lib/source-map.ts` for how those are handled on the way out.
      'strapi-encode-source-maps': options.draft ? 'true' : 'false',
    },
  });

  if (!response.ok) {
    throw new StrapiError(
      `Strapi responded ${response.status} for /${path}`,
      response.status,
      path
    );
  }

  const json = (await response.json()) as { data: T };
  return json.data;
}

/** Fetches many entries from a collection type. */
export function fetchCollection<T>(
  collection: string,
  options: FetchOptions = {}
): Promise<T[]> {
  return request<T[]>(collection, options);
}

/** Fetches a single-type entry (e.g. `global`). */
export function fetchSingle<T>(
  singleType: string,
  options: FetchOptions = {}
): Promise<T> {
  return request<T>(singleType, options);
}

/**
 * Fetches one entry from a collection by slug. Returns null when nothing
 * matches, so callers can render a 404 rather than crashing on `undefined`.
 */
export async function fetchBySlug<T>(
  collection: string,
  slug: string,
  options: FetchOptions = {}
): Promise<T | null> {
  const entries = await fetchCollection<T>(collection, {
    ...options,
    filters: { ...options.filters, slug: { $eq: slug } },
  });
  return entries[0] ?? null;
}
