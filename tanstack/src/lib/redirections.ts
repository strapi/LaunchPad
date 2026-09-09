import { getStrapiURL } from '@/lib/utils';

/**
 * Strapi-managed redirects.
 *
 * Editors maintain a `redirections` collection in Strapi (`source` ->
 * `destination`, both locale-relative, e.g. `/old-pricing` -> `/pricing`).
 *
 * Next applies these via `next.config.mjs`'s async `redirects()`, which runs
 * once at build time. We can't do that here — the locale prefix is resolved
 * per request in middleware — so the list is fetched lazily on the first
 * request and cached in module scope for `TTL_MS`.
 *
 * Consequences of the different timing, both in our favour:
 *   - A new redirect goes live within the TTL instead of needing a rebuild.
 *   - Strapi being down at boot doesn't break the app; we serve an empty
 *     list and retry on the next request after the TTL.
 */

interface Redirection {
  source: string;
  destination: string;
}

const TTL_MS = 60_000;

let cache: Array<Redirection> = [];
let fetchedAt = 0;
let inFlight: Promise<Array<Redirection>> | null = null;

async function fetchRedirections(): Promise<Array<Redirection>> {
  try {
    const res = await fetch(`${getStrapiURL()}/api/redirections`);
    if (!res.ok) return [];
    const json = (await res.json()) as { data?: Array<Partial<Redirection>> };
    return (json.data ?? []).filter(
      (entry): entry is Redirection =>
        typeof entry.source === 'string' &&
        typeof entry.destination === 'string' &&
        entry.source.length > 0 &&
        entry.destination.length > 0
    );
  } catch (error) {
    console.warn(
      '[redirections] Failed to fetch redirects from Strapi:',
      error instanceof Error ? error.message : error
    );
    return [];
  }
}

async function getRedirections(): Promise<Array<Redirection>> {
  const now = performance.timeOrigin + performance.now();
  if (fetchedAt !== 0 && now - fetchedAt < TTL_MS) return cache;

  // Collapse concurrent misses into one request.
  inFlight ??= fetchRedirections().then((result) => {
    cache = result;
    fetchedAt = performance.timeOrigin + performance.now();
    inFlight = null;
    return result;
  });

  return inFlight;
}

/**
 * Given a locale-prefixed pathname (`/en/old-pricing`), returns the
 * locale-prefixed destination (`/en/pricing`) if Strapi has a matching
 * redirect, otherwise null.
 *
 * Matching is on the path AFTER the locale segment, so a single Strapi entry
 * covers every locale — the same shape as Next's `/:locale${source}` rule.
 */
export async function resolveRedirect(
  locale: string,
  pathnameWithoutLocale: string
): Promise<string | null> {
  const redirections = await getRedirections();
  const match = redirections.find(
    (entry) => entry.source === pathnameWithoutLocale
  );
  if (!match) return null;
  return `/${locale}${match.destination}`;
}
