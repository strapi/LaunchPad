import { getStrapiSource } from '@/lib/strapi/source-map';
import { getStrapiURL, stripStegaMarkers } from '@/lib/utils';

/**
 * Resolves a Strapi media URL to an absolute URL.
 * Strapi returns relative paths like "/uploads/foo.png" for local uploads.
 *
 * Also strips the invisible source-map markers Strapi embeds in draft mode —
 * left in place they get percent-encoded into the request and 404.
 */
export function strapiImage(url: string): string {
  if (!url) return url;

  const cleanUrl = stripStegaMarkers(url);

  if (cleanUrl.startsWith('/')) {
    return getStrapiURL() + cleanUrl;
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
