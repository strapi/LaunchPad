import { createStrapiClient } from '#shared/lib/strapi';

/**
 * The Strapi client, bound to the configured backend URL.
 *
 * Auto-imported into every server route (Nitro picks up `server/utils`), so
 * handlers just call `useStrapi()`.
 */
export function useStrapi() {
  return createStrapiClient(useRuntimeConfig().public.strapiUrl);
}

/** The Strapi origin, for the auth helpers that build their own URLs. */
export function strapiBaseUrl(): string {
  return useRuntimeConfig().public.strapiUrl;
}
