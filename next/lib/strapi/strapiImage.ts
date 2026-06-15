import { unstable_noStore as noStore } from 'next/cache';
import { API_URL, stripStegaMarkers } from '../utils';
import { getStrapiSource } from './sourceMap';

export function strapiImage(url: string): string {
  noStore();

  const cleanUrl = stripStegaMarkers(url);

  if (cleanUrl.startsWith('/')) {
    return API_URL + cleanUrl;
  }

  return cleanUrl;
}

/**
 * Resolve a raw Strapi media URL into the props an image element needs to be
 * both displayable AND click-to-edit in the live preview:
 *  - `src`: the cleaned, host-resolved URL
 *  - `data-strapi-source`: the visual-editing field mapping, decoded from the
 *    RAW url *before* cleaning strips it (undefined outside draft mode, so the
 *    attribute is simply omitted in production)
 *
 * Spread directly onto the element so the source mapping can't be forgotten:
 *   <BlurImage {...resolveStrapiMedia(image.url)} alt={...} width={...} />
 */
export function resolveStrapiMedia(url: string | null | undefined) {
  return {
    src: strapiImage(url ?? ''),
    'data-strapi-source': getStrapiSource(url),
  };
}
