/**
 * Content source map markers.
 *
 * In draft mode the frontend asks Strapi for content source maps
 * (`strapi-encode-source-maps: true`) and Strapi answers by appending invisible
 * stega characters to *every* string field it returns. Strapi's preview overlay
 * walks the rendered text nodes, decodes those markers and turns the element
 * they sit in into a click-to-edit target.
 *
 * That only works in visible text. The moment a Strapi string becomes an HTML
 * attribute — an `href`, a `src`, a `target` — the markers stop being invisible
 * punctuation and start being part of a value the browser has to parse:
 *
 *   - the overlay never looks at them there, so nothing is gained;
 *   - the browser percent-encodes them when it builds the request, so
 *     `/en/contact` becomes `/en/contact%E2%80%8B%E2%80%8B…` and the link is
 *     dead (measured: HTTP 500 from the server, and a client-side route with no
 *     match under NuxtLink);
 *   - anything comparing the value against a literal — `target === '_blank'`,
 *     `url.startsWith('http')` — quietly stops matching.
 *
 * So: leave the markers in text, strip them everywhere a Strapi string turns
 * into an attribute. Keep this the single definition of "strip" so the text and
 * attribute sides cannot drift apart.
 */
export const stripStegaMarkers = (value: string): string =>
  value.replace(/[\u200B-\u200D\u2060\uFEFF]/g, '');
