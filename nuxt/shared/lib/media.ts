/**
 * Media URL handling.
 *
 * These take the Strapi base URL as an argument rather than reading it from
 * config themselves. Code under `shared/` runs in both the Vue app and the
 * Nitro server, and those two reach configuration by different routes
 * (`useRuntimeConfig()` resolves differently in each). Passing it in keeps
 * these functions pure and usable from either side — callers already have the
 * config in hand.
 */

/**
 * Strapi's content source maps append invisible stega characters to every
 * string when draft mode requests them. They are harmless inside visible text
 * — that is the whole point, the preview overlay reads them — but inside a URL
 * the browser percent-encodes them, and the request 404s.
 *
 * So every media URL is stripped on its way into the DOM.
 */
export const stripStegaMarkers = (value: string): string =>
  value.replace(/[\u200B-\u200D\u2060\uFEFF]/g, '');

/**
 * Resolves a Strapi media URL to something the browser can load.
 *
 * Local uploads come back as relative paths (`/uploads/foo.png`) which would
 * otherwise resolve against the Nuxt origin rather than Strapi.
 */
export function strapiMedia(
  url: string | null | undefined,
  baseUrl: string
): string | null {
  if (!url) return null;

  const clean = stripStegaMarkers(url);
  if (clean.startsWith('data:')) return clean;
  if (clean.startsWith('http') || clean.startsWith('//')) return clean;

  return `${baseUrl}${clean}`;
}

/**
 * Blocks (rich text) content stores whatever URL the authoring environment
 * had, so an `/uploads/...` path has to be rebuilt against the current Strapi
 * host before rendering.
 */
export function normalizeStrapiMediaUrl(url: string, baseUrl: string): string {
  const clean = stripStegaMarkers(url);
  try {
    const { pathname } = new URL(clean, baseUrl || 'http://localhost');
    if (pathname.startsWith('/uploads/')) return `${baseUrl}${pathname}`;
  } catch {
    // not a parseable URL; render it unchanged
  }
  return clean;
}

/** True when a Strapi media entry is a video rather than an image. */
export const isVideo = (mime?: string | null): boolean =>
  !!mime?.startsWith('video/');

/** True when a Strapi media entry is audio. */
export const isAudio = (mime?: string | null): boolean =>
  !!mime?.startsWith('audio/');
