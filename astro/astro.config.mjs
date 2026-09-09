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
    plugins: [
      tailwindcss(),

      // Compiles the copied Next components under src/components/react/.
      //
      // @astrojs/react would normally do this, but it pulls in Rolldown's
      // native React Fast Refresh plugin, which throws "Missing field
      // `moduleType`" and breaks every transform in dev — Astro's own scoped
      // styles included. esbuild ships with Vite, so calling it directly is
      // the smallest thing that works, and it keeps React's transform scoped
      // to this one folder. Nuxt mounts the same island the same way.
      {
        name: 'launchpad:react-island',
        enforce: 'pre',
        async transform(code, id) {
          if (!/[\\/]src[\\/]components[\\/]react[\\/].*\.[jt]sx$/.test(id)) {
            return null;
          }
          const { transform } = await import('esbuild');
          const result = await transform(code, {
            loader: 'tsx',
            jsx: 'automatic',
            jsxImportSource: 'react',
            sourcefile: id,
            sourcemap: true,
          });
          return { code: result.code, map: result.map };
        },
      },
    ],

    // The mount script and the island must share one React instance, or hooks
    // throw "Invalid hook call".
    resolve: { dedupe: ['react', 'react-dom'] },

    build: {
      rollupOptions: {
        // framer-motion ships "use client" on ~60 modules. The directive is a
        // Next convention and means nothing here, so the bundler warns about
        // ignoring it on every build. Nothing is wrong; just quiet it.
        onwarn(warning, warn) {
          const isUseClientNotice =
            warning.message?.includes('Module level directives') &&
            warning.message?.includes('use client');
          if (isUseClientNotice) return;
          warn(warning);
        },
      },
    },

    optimizeDeps: {
      include: [
        'react',
        'react/jsx-runtime',
        'react-dom',
        'react-dom/client',
        'framer-motion',
        '@react-three/fiber',
        '@react-three/drei',
        '@tsparticles/react',
        '@tsparticles/engine',
        '@tsparticles/slim',
        'three',
        'three-globe',
      ],
    },

    // Astro 6 runs on Rolldown, whose *native* React Fast Refresh plugin
    // crashes with "Missing field `moduleType`" and takes the whole transform
    // pipeline down with it — Astro's own scoped styles 500 in dev. Falling
    // back to the JS implementations fixes it. Fast Refresh only buys HMR for
    // React state, and the React here is a set of static visuals.
    experimental: { enableNativePlugin: false },
  },
});
