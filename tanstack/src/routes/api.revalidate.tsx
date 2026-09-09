import { createFileRoute } from '@tanstack/react-router';
import type { Dirent } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Strapi revalidation webhook.
 *
 * URL: POST /api/revalidate
 * Auth: Strapi sends `Authorization: Bearer <REVALIDATE_SECRET>` via
 *       its `config/server` `webhooks.defaultHeaders` or per-webhook
 *       headers config.
 *
 * Payload shape (from Strapi admin → Settings → Webhooks):
 *   {
 *     "event": "entry.publish" | "entry.update" | "entry.unpublish" | ...,
 *     "createdAt": "2026-04-10T23:00:00.000Z",
 *     "model": "article" | "page" | "product" | "global" | ...,
 *     "uid": "api::article.article",
 *     "entry": { id, slug, locale, ... }
 *   }
 *
 * Invalidation strategy:
 *   Strapi tells us WHAT changed; we delete the corresponding prerendered
 *   HTML file(s) from `.output/public/`. The next request for that URL
 *   misses the static cache and falls through to SSR, which re-fetches
 *   from Strapi and serves fresh content. The HTML file stays missing
 *   until the next full `yarn build`.
 *
 *   Tradeoff: post-invalidation requests are slower (dynamic SSR vs static
 *   HTML) until a rebuild. For high-traffic production setups you'd want
 *   to re-prerender on-demand, but that requires invoking the build
 *   pipeline from a request handler, which is out of scope for now.
 *
 * Model → path mapping:
 *   page        → `/{locale}/{slug}` (or `/{locale}` if slug === 'homepage')
 *   article     → `/{locale}/blog/{slug}` + `/{locale}/blog` (list)
 *   product     → `/{locale}/products/{slug}` + `/{locale}/products` (list)
 *   blog-page   → `/{locale}/blog`
 *   product-page → `/{locale}/products`
 *   global      → EVERY prerendered HTML (navbar/footer is on every page)
 *
 * Locale handling: if `entry.locale` is set, invalidate that locale only;
 * otherwise invalidate both `en` and `fr`.
 */

const LOCALES = ['en', 'fr'] as const;

interface StrapiWebhookPayload {
  event?: string;
  model?: string;
  uid?: string;
  entry?: {
    id?: number;
    slug?: string;
    locale?: string;
    [key: string]: unknown;
  };
}

/**
 * Resolves a URL path (e.g. `/en/blog/foo`) to the filesystem path of its
 * prerendered HTML file, WITH path-traversal protection. Returns null if
 * the resolved path escapes the public output directory.
 */
function resolvePrerenderedHtmlPath(
  publicDir: string,
  urlPath: string
): string | null {
  // Strip leading slash so path.join doesn't treat it as absolute
  const cleanPath = urlPath.replace(/^\/+/, '');
  const resolved = path.resolve(publicDir, cleanPath, 'index.html');
  // Directory-traversal guard: resolved must stay inside publicDir
  if (!resolved.startsWith(publicDir + path.sep)) {
    return null;
  }
  return resolved;
}

async function deleteIfExists(filePath: string): Promise<boolean> {
  try {
    await fs.unlink(filePath);
    return true;
  } catch (err: any) {
    if (err?.code === 'ENOENT') return false;
    throw err;
  }
}

/**
 * Recursively finds all `index.html` files under a directory.
 * Used for the `global` nuke-everything case.
 */
async function findAllHtmlFiles(
  dir: string,
  collected: Array<string> = []
): Promise<Array<string>> {
  let entries: Array<Dirent>;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return collected;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await findAllHtmlFiles(full, collected);
    } else if (entry.isFile() && entry.name === 'index.html') {
      collected.push(full);
    }
  }
  return collected;
}

/**
 * Maps a Strapi webhook payload to the set of URL paths that should be
 * invalidated. Handles locale scoping — if the entry is i18n'd with an
 * explicit locale, only that locale's path is invalidated; otherwise both.
 */
function pathsForPayload(payload: StrapiWebhookPayload): Array<string> {
  const { model, entry } = payload;
  if (!model) return [];

  const slug = typeof entry?.slug === 'string' ? entry.slug : null;
  const entryLocale = typeof entry?.locale === 'string' ? entry.locale : null;
  const locales = entryLocale
    ? [entryLocale]
    : (LOCALES as ReadonlyArray<string>);

  const paths = new Set<string>();

  switch (model) {
    case 'page':
      if (!slug) break;
      for (const locale of locales) {
        if (slug === 'homepage') {
          paths.add(`/${locale}`);
        } else {
          paths.add(`/${locale}/${slug}`);
        }
      }
      break;

    case 'article':
      if (!slug) break;
      for (const locale of locales) {
        paths.add(`/${locale}/blog/${slug}`);
        paths.add(`/${locale}/blog`);
      }
      break;

    case 'product':
      if (!slug) break;
      for (const locale of locales) {
        paths.add(`/${locale}/products/${slug}`);
        paths.add(`/${locale}/products`);
      }
      break;

    case 'blog-page':
      for (const locale of locales) paths.add(`/${locale}/blog`);
      break;

    case 'product-page':
      for (const locale of locales) paths.add(`/${locale}/products`);
      break;

    // `global`, and anything else, is handled separately (nuke all HTML).
    default:
      break;
  }

  return Array.from(paths);
}

export const Route = createFileRoute('/api/revalidate')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // ---- 1. Auth ----
        const authHeader = request.headers.get('authorization') ?? '';
        const expected = process.env.REVALIDATE_SECRET;
        if (!expected) {
          return new Response(
            JSON.stringify({
              success: false,
              error:
                'REVALIDATE_SECRET is not configured on the server. Refusing all webhooks.',
            }),
            { status: 500, headers: { 'content-type': 'application/json' } }
          );
        }
        if (authHeader !== `Bearer ${expected}`) {
          return new Response(
            JSON.stringify({ success: false, error: 'Unauthorized' }),
            { status: 401, headers: { 'content-type': 'application/json' } }
          );
        }

        // ---- 2. Parse payload ----
        let payload: StrapiWebhookPayload;
        try {
          payload = (await request.json()) as StrapiWebhookPayload;
        } catch {
          return new Response(
            JSON.stringify({ success: false, error: 'Invalid JSON body' }),
            { status: 400, headers: { 'content-type': 'application/json' } }
          );
        }

        // ---- 3. Compute paths + delete ----
        const publicDir = path.resolve(process.cwd(), '.output/public');
        const deleted: Array<string> = [];
        const skipped: Array<{ path: string; reason: string }> = [];

        // Global single type: nuke every prerendered HTML file.
        if (payload.model === 'global') {
          const allHtml = await findAllHtmlFiles(publicDir);
          for (const file of allHtml) {
            try {
              await fs.unlink(file);
              deleted.push(path.relative(publicDir, file));
            } catch (err: any) {
              skipped.push({
                path: path.relative(publicDir, file),
                reason: err?.message ?? 'unknown',
              });
            }
          }

          console.log(
            `[revalidate] Nuked ${deleted.length} HTML files (model=global)`
          );
        } else {
          const urlPaths = pathsForPayload(payload);
          for (const urlPath of urlPaths) {
            const filePath = resolvePrerenderedHtmlPath(publicDir, urlPath);
            if (!filePath) {
              skipped.push({ path: urlPath, reason: 'path traversal blocked' });
              continue;
            }
            try {
              const wasDeleted = await deleteIfExists(filePath);
              if (wasDeleted) {
                deleted.push(urlPath);
              } else {
                skipped.push({ path: urlPath, reason: 'file not present' });
              }
            } catch (err: any) {
              skipped.push({
                path: urlPath,
                reason: err?.message ?? 'unknown',
              });
            }
          }

          console.log(
            `[revalidate] event=${payload.event} model=${payload.model} deleted=${deleted.length}`
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
            event: payload.event ?? null,
            model: payload.model ?? null,
            deleted,
            skipped,
          }),
          {
            status: 200,
            headers: { 'content-type': 'application/json' },
          }
        );
      },
    },
  },
});
