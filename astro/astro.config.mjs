// @ts-check
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

// Astro exposes .env to the app, but this config file runs before that — so it
// reads the file directly. Without this the PORT in .env would be ignored here
// and the dev server would always take the default.
const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');

const PORT = Number(env.PORT) || 4321;
const SITE = env.WEBSITE_URL || `http://localhost:${PORT}`;

/**
 * Hybrid rendering.
 *
 * `output: 'static'` with the node adapter means every page is prerendered by
 * default, and anything that opts out with `export const prerender = false`
 * gets rendered per request. That is what draft-mode preview needs: the public
 * site stays fully static, while `/api/preview` and the draft-mode reads run
 * live against Strapi.
 *
 * The adapter is required even for a mostly-static build — without it, the
 * on-demand routes have no server to run on.
 */
export default defineConfig({
  site: SITE,
  output: 'static',
  adapter: node({ mode: 'standalone' }),

  // LaunchPad ships English and French. `prefixDefaultLocale` keeps both under
  // an explicit prefix (/en, /fr) so the routes match the other ports and the
  // locale is never implicit.
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },

  server: { port: PORT },

  vite: {
    plugins: [tailwindcss()],
  },
});
