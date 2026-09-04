// @ts-check
import node from '@astrojs/node';
import react from '@astrojs/react';
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

  // The features section reuses LaunchPad's Next components verbatim so all
  // four frontends render an identical visual. They are the only React on the
  // site — islands keep that contained to one section, and everything else
  // stays plain Astro. Delete the island and the React dependencies to go
  // back to a pure-Astro build.
  integrations: [react()],

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

    // Astro 6 runs on Rolldown, whose *native* React Fast Refresh plugin
    // crashes with "Missing field `moduleType`" and takes the whole transform
    // pipeline down with it — Astro's own scoped styles 500 in dev. Falling
    // back to the JS implementations fixes it. Fast Refresh only buys HMR for
    // React state, and the React here is a set of static visuals.
    experimental: { enableNativePlugin: false },
  },
});
