import { vercelStegaDecode } from '@vercel/stega';

/**
 * Strapi's live-preview visual editing works by embedding "content source maps"
 * — invisible stega markers — into every string field when the frontend requests
 * them in draft mode (`strapi-encode-source-maps: true`, see
 * `@/data/strapi-sdk`). Strapi's preview script (injected into the iframe by
 * `<Preview>`) normally decodes those markers straight out of an <img>'s `src`
 * attribute to learn which field the image maps to.
 *
 * We can't rely on that here: every media URL passes through
 * `stripStegaMarkers` before it reaches the DOM, because markers left inside a
 * URL get percent-encoded by the browser and break the request.
 *
 * So this helper decodes the markers from the *raw* Strapi URL ourselves,
 * before the URL is cleaned, and returns the field-mapping string to render as
 * a literal `data-strapi-source` attribute. The preview script's highlight
 * system reads that attribute directly, so the image stays click-to-replace
 * without depending on markers surviving the URL.
 *
 * Returns `undefined` when there are no markers (e.g. production / non-draft),
 * so callers can spread it and React simply omits the attribute.
 *
 * Port of the Next launchpad's `lib/strapi/sourceMap.ts`.
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

  // The encoded value sits on the media's inner `url` field, so its path is e.g.
  // `hero.url`. Strip the trailing `.url` so the highlight focuses the media
  // field itself — mirroring exactly what Strapi's preview script does for
  // media elements (it does the same string replace before setting the source
  // attribute). Keep this as a string replace rather than re-serializing the
  // params, so our output is byte-for-byte what Strapi would have produced.
  const pathMatch = /path=([^&]+)/.exec(source);
  if (pathMatch) {
    const originalPath = pathMatch[1];
    const mediaPath = originalPath.replace(/\.url$/, '');
    return source.replace(`path=${originalPath}`, `path=${mediaPath}`);
  }

  return source;
}
