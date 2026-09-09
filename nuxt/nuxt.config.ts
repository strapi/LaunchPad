import tailwindcss from '@tailwindcss/vite';

/**
 * Nuxt reads `.env` before this file is evaluated, so `process.env` is already
 * populated here — no explicit dotenv loading needed.
 */
const PORT = Number(process.env.PORT) || 3001;
const SITE = process.env.WEBSITE_URL || `http://localhost:${PORT}`;

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  css: ['~/assets/css/global.css'],

  /**
   * Flat component names regardless of folder, so `blocks/Hero.vue` is `<Hero>`
   * rather than `<BlocksHero>` — the subfolders group the files, they are not
   * part of the name.
   */
  components: [{ path: '~/components', pathPrefix: false }],

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap',
        },
      ],
      script: [
        {
          // Marks that scripts are running, before first paint. The scroll
          // reveal styles hang off this class, so with JavaScript disabled the
          // content is simply visible instead of stuck at opacity 0.
          innerHTML: "document.documentElement.classList.add('js-reveal')",
          tagPosition: 'head',
        },
      ],
    },
  },

  /**
   * `STRAPI_URL` is public because the browser needs it too: media lives on
   * Strapi, so every `<img src>` is built from it. The other two never leave
   * the server — `runtimeConfig` (as opposed to `runtimeConfig.public`) is not
   * serialised into the payload.
   */
  runtimeConfig: {
    previewSecret: process.env.PREVIEW_SECRET,
    sessionSecret: process.env.SESSION_SECRET,
    public: {
      strapiUrl: process.env.STRAPI_URL || 'http://localhost:1337',
      siteUrl: SITE,
    },
  },

  /**
   * Hybrid rendering, the same shape as the Astro port.
   *
   * The public site is prerendered at build time; `/preview/**` and the API
   * routes are rendered per request. That split is what draft mode needs —
   * "what does this look like right now" cannot be answered by a page that was
   * built an hour ago.
   *
   * Routes are discovered by crawling from the two locale roots rather than
   * listed here: articles, products and CMS pages all come from Strapi, so any
   * hardcoded list would go stale the moment an editor adds an entry. The
   * navbar and index pages link to everything, so the crawler reaches it all.
   */
  routeRules: {
    '/': { redirect: '/en' },
    '/preview/**': { prerender: false },
    '/api/**': { prerender: false },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/en', '/fr'],
      // A single unreachable entry should not fail the whole build; the route
      // falls back to being rendered on demand.
      failOnError: false,
    },
  },

  devServer: { port: PORT },

  vite: {
    plugins: [
      tailwindcss(),

      // Compiles the copied Next components under app/react/.
      //
      // Nuxt's Vue JSX transform claims .tsx by default and turns these into
      // Vue VNodes, which React rejects. Narrowing vueJsx (below) stops that,
      // but then nothing transforms them — Vite's esbuild pass does not pick
      // up a jsx setting for these files. @vitejs/plugin-react is not an
      // option either: it imports `vite/internal`, which the Vite bundled
      // with Nuxt does not export.
      //
      // esbuild ships with Vite, so calling it directly is the smallest thing
      // that works, and it keeps React's transform scoped to this one folder.
      {
        name: 'launchpad:react-island',
        enforce: 'pre' as const,
        async transform(code: string, id: string) {
          if (!/[\\/]app[\\/]react[\\/].*\.[jt]sx$/.test(id)) return null;
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

    // The features section renders LaunchPad's Next components directly (see
    // app/components/blocks/FeaturesGrid.client.vue). Those are React .tsx
    // files, but Nuxt's Vue JSX transform claims .tsx by default and compiles
    // them into Vue VNodes, which React then rejects as invalid children.
    // Nothing in this app uses Vue JSX, so that transform is narrowed to .jsx
    // and .tsx is left to esbuild with React's automatic runtime.
    vueJsx: {
      include: [/\.jsx$/],
    },

    esbuild: {
      jsx: 'automatic',
      jsxImportSource: 'react',
    },

    // The bridge component and the island must share one React instance, or
    // hooks throw "Invalid hook call".
    resolve: {
      dedupe: ['react', 'react-dom'],
    },

    // Everything the island touches is pre-bundled together, so React and
    // every library that reaches into its internals share one instance.
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
  },

  typescript: {
    typeCheck: false,
    strict: true,
    tsConfig: {
      compilerOptions: {
        jsx: 'react-jsx',
        jsxImportSource: 'react',
      },
    },
  },
});
