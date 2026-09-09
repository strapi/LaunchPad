import { strapi } from '@strapi/client';

import { getStrapiURL } from '@/lib/utils';
import type { TAuthUser } from '@/types/auth';

const BASE_API_URL = getStrapiURL() + '/api';

/**
 * Default Strapi client. Used by code paths that don't care about draft
 * mode or content source maps — e.g. auth / session flows.
 */
export const sdk = strapi({ baseURL: BASE_API_URL });

/**
 * Returns a Strapi client configured for content fetches.
 *
 * When `draft` is true, the client sends the `strapi-encode-source-maps`
 * header on every request, which tells Strapi to embed invisible markers
 * in the response content. Strapi's preview iframe then uses those markers
 * to make each field clickable — clicking a field in the preview jumps
 * the admin UI to that field in the content editor.
 *
 * Port of the Next launchpad's `createClient(config, isDraftMode)` helper
 * in `lib/strapi/client.ts`.
 */
export function getContentClient(draft: boolean) {
  return strapi({
    baseURL: BASE_API_URL,
    headers: {
      'strapi-encode-source-maps': draft ? 'true' : 'false',
    },
  });
}

/**
 * Returns a collection bound to an authenticated SDK instance.
 * Used for user-scoped requests (e.g. comments, cart) in later slices.
 */
export const getAuthenticatedCollection = (
  collectionName: string,
  jwt: string
) => {
  const authenticatedSdk = strapi({
    baseURL: BASE_API_URL,
    auth: jwt,
  });
  return authenticatedSdk.collection(collectionName);
};

/**
 * Fetches the currently authenticated user from Strapi's /users/me endpoint
 * using a JWT. Used by `getAuth()` to validate session cookies against the
 * live Strapi user table.
 */
export async function getUserMe(jwt: string): Promise<TAuthUser> {
  const authenticatedSdk = strapi({
    baseURL: BASE_API_URL,
    auth: jwt,
  });

  const response = await authenticatedSdk.fetch('/users/me');

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.statusText}`);
  }

  return response.json() as Promise<TAuthUser>;
}
