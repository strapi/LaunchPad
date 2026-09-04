import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig, loadEnv } from 'vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';

const LOCALES = ['en', 'fr'] as const;

/**
 * Queries Strapi at build time for all slugs across `pages`, `articles`,
 * and `products`, then expands them across every locale.
 *
 * Returns a de-duplicated list of paths (e.g. `/en`, `/fr/blog/foo`,
 * `/en/products/bar`) that will be prerendered to static HTML.
 *
 * Runs only in `mode === 'production'` (see `defineConfig` below). Wraps
 * each Strapi fetch in try/catch so a CMS outage doesn't fail the build —
 * the dynamic routes fall through to SSR at runtime instead.
 *
 * Port of the tanstack-example's helper at
 * `tanstack-example/client/vite.config.ts` with three differences:
 *   1. Iterates over LOCALES and prefixes every path
 *   2. Includes `products` (our example doesn't)
 *   3. Handles the `homepage` pages-collection entry by mapping it to
 *      `/${locale}` instead of `/${locale}/homepage`
 */
async function getPrerenderPaths(strapiUrl: string): Promise<Array<string>> {
  const STRAPI_URL = strapiUrl;
  const paths = new Set<string>();

  // Always include locale homes + blog / products indexes
  for (const locale of LOCALES) {
    paths.add(`/${locale}`);
    paths.add(`/${locale}/blog`);
    paths.add(`/${locale}/products`);
  }

  async function fetchSlugs(collection: string): Promise<Array<string>> {
    try {
      const res = await fetch(
        `${STRAPI_URL}/api/${collection}?fields[0]=slug&pagination[pageSize]=100`
      );
      if (!res.ok) return [];
      const json = (await res.json()) as {
        data?: Array<{ slug?: string }>;
      };
      return (json.data ?? [])
        .map((entry) => entry.slug)
        .filter((s): s is string => typeof s === 'string' && s.length > 0);
    } catch (error) {
      console.warn(
        `[Prerender] Failed to fetch ${collection} slugs from Strapi:`,
        error
      );
      return [];
    }
  }

  const [pageSlugs, articleSlugs, productSlugs] = await Promise.all([
    fetchSlugs('pages'),
    fetchSlugs('articles'),
    fetchSlugs('products'),
  ]);

  for (const locale of LOCALES) {
    // Pages: `/${locale}/${slug}` — but `homepage` maps to `/${locale}`
    for (const slug of pageSlugs) {
      if (slug === 'homepage') continue;
      paths.add(`/${locale}/${slug}`);
    }

    // Articles: `/${locale}/blog/${slug}`
    for (const slug of articleSlugs) {
      paths.add(`/${locale}/blog/${slug}`);
    }

    // Products: `/${locale}/products/${slug}`
    for (const slug of productSlugs) {
      paths.add(`/${locale}/products/${slug}`);
    }
  }

  const result = Array.from(paths).sort();
  console.log(
    `[Prerender] ${result.length} paths to prerender across ${LOCALES.length} locales`
  );
  return result;
}

const config = defineConfig(async ({ mode }) => {
  // Read the whole .env (not just VITE_*), so the dev-server port and the
  // Strapi URL are configurable without editing this file. Lets a second
  // instance run alongside another LaunchPad stack on different ports.
  const env = loadEnv(mode, process.cwd(), '');
  const port = Number(env.PORT) || 3000;
  const strapiUrl = env.VITE_STRAPI_URL || 'http://localhost:1337';

  const prerenderPaths =
    mode === 'production' ? await getPrerenderPaths(strapiUrl) : [];

  // Per-path prerender config for tanstackStart's `pages` option
  const pages = prerenderPaths.map((path) => ({
    path,
    prerender: { enabled: true },
  }));

  return {
    server: { port },
    preview: { port },
    plugins: [
      viteTsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
      tailwindcss(),
      tanstackStart({
        prerender: {
          enabled: mode === 'production',
          crawlLinks: true,
          autoStaticPathsDiscovery: true,
          // Routes that should NEVER be prerendered (dynamic per-request,
          // or don't make sense as static HTML).
          filter: ({ path }) => {
            const excludedPrefixes = [
              '/api/', // preview / exit-preview / auth RPC
              '/_serverFn', // server function RPC endpoint
            ];
            const excludedSuffixes = ['/sign-up', '/sign-in'];
            if (excludedPrefixes.some((p) => path.startsWith(p))) return false;
            if (excludedSuffixes.some((s) => path.endsWith(s))) return false;
            return true;
          },
          // A single bad page shouldn't nuke the whole build. Failed paths
          // fall through to SSR at runtime.
          failOnError: false,
        },
        pages,
      }),
      // Nitro wraps the Web fetch handler produced by tanstackStart in a
      // Node HTTP server (or serverless adapter). Without this, the build
      // emits `dist/server/server.js` as a raw fetch-style module that
      // doesn't `.listen()`. With it, we get `.output/server/index.mjs`
      // which is directly runnable with `node` as a long-lived HTTP server.
      nitro(),
      viteReact(),
    ],
  };
});

export default config;
