import { vercelStegaDecode } from '@vercel/stega';

/**
 * Content source maps — what makes media click-to-editable in Strapi's preview.
 *
 * In draft mode the API embeds invisible stega markers into every string,
 * including media URLs. Strapi's preview overlay normally reads those markers
 * straight out of an `<img>`'s `src` to work out which field the image came
 * from.
 *
 * We cannot leave them there: markers inside a URL get percent-encoded by the
 * browser and the request 404s, so `strapiMedia()` strips them. That would
 * leave the overlay with nothing to find.
 *
 * So the mapping is decoded from the *raw* URL before stripping and rendered as
 * a literal `data-strapi-source` attribute instead. The overlay also collects
 * elements that already carry the attribute, so it works either way.
 *
 * Returns undefined outside draft mode, where no markers exist — callers can
 * bind that straight to an attribute and Vue omits it.
 */
export function getStrapiSource(
  url: string | null | undefined
): string | undefined {
  if (!url) return undefined;

  let decoded: unknown;
  try {
    decoded = vercelStegaDecode(url);
  } catch {
    return undefined;
  }

  if (
    !decoded ||
    typeof decoded !== 'object' ||
    !('strapiSource' in decoded) ||
    typeof decoded.strapiSource !== 'string'
  ) {
    return undefined;
  }

  const source = decoded.strapiSource;

  // The marker is encoded on the media's inner `url` field, so its path reads
  // e.g. `hero.url`. Trimming the trailing `.url` focuses the highlight on the
  // media field itself, which is what Strapi's own preview script does for
  // media elements. Kept as a string replace so the output is byte-for-byte
  // what Strapi would have produced.
  const pathMatch = /path=([^&]+)/.exec(source);
  const originalPath = pathMatch?.[1];
  if (originalPath) {
    const mediaPath = originalPath.replace(/\.url$/, '');
    return source.replace(`path=${originalPath}`, `path=${mediaPath}`);
  }

  return source;
}
