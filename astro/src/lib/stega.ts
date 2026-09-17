/**
 * Content source maps — the invisible half of Strapi's live preview.
 *
 * In draft mode the frontend asks for source maps (`strapi-encode-source-maps`)
 * and Strapi appends invisible stega characters to every string it returns.
 * Strapi's preview overlay walks the rendered text nodes, decodes those
 * markers, and turns the element they came from into a click-to-edit target.
 *
 * That only works in *visible text*. The moment a marked string becomes an
 * HTML attribute — an `href`, a `src`, a form field `name` — the markers stop
 * being invisible and start being wrong: the browser percent-encodes them into
 * the URL and the link 404s, an unrecognised `target` opens a new window, a
 * field name arrives at the server with junk in it.
 *
 * So the rule is: leave the markers in text, strip them out of attributes.
 * `src/lib/source-map.ts` covers the one case where an attribute still needs
 * the mapping — media URLs, which re-emit it as `data-strapi-source`.
 */
export const stripStegaMarkers = (value: string): string =>
  value.replace(/[\u200B-\u200D\u2060\uFEFF]/g, '');
