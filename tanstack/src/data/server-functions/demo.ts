import { createServerFn } from '@tanstack/react-start';

/**
 * Reports whether this instance is one of the hosted Strapi demos.
 *
 * Mirrors the Next launchpad's `process.env.NEXT_IS_DEMO === 'true'` check in
 * `app/[locale]/layout.tsx`. It has to run on the server: the flag is a
 * server-only env var, and `import.meta.env` would require a `VITE_` prefix
 * that leaks it into the client bundle.
 *
 * When true the layout renders `<Banner>` and offsets the navbar to clear it.
 */
export const isDemoServerFunction = createServerFn({ method: 'GET' }).handler(
  () => {
    return (
      process.env.IS_DEMO === 'true' || process.env.NEXT_IS_DEMO === 'true'
    );
  }
);
