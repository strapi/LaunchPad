import { stripStegaMarkers } from '@/lib/stega';
import { STRAPI_URL } from '@/lib/strapi';

/**
 * Resolves a Strapi media URL to something the browser can load.
 *
 * Local uploads come back as relative paths (`/uploads/foo.png`) which would
 * otherwise resolve against the Astro origin rather than Strapi.
 */
export function strapiMedia(url: string | null | undefined): string | null {
  if (!url) return null;

  const clean = stripStegaMarkers(url);
  if (clean.startsWith('data:')) return clean;
  if (clean.startsWith('http') || clean.startsWith('//')) return clean;

  return `${STRAPI_URL}${clean}`;
}

/**
 * Blocks (rich text) content stores whatever URL the authoring environment
 * had, so an `/uploads/...` path has to be rebuilt against the current Strapi
 * host before rendering.
 */
export function normalizeStrapiMediaUrl(url: string): string {
  const clean = stripStegaMarkers(url);
  try {
    const { pathname } = new URL(clean, STRAPI_URL || 'http://localhost');
    if (pathname.startsWith('/uploads/')) return `${STRAPI_URL}${pathname}`;
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
