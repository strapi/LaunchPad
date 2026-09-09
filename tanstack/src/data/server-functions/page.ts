import { createServerFn } from '@tanstack/react-start';

import { getContentClient } from '@/data/strapi-sdk';
import { isDraftMode } from '@/lib/draft-mode';

/**
 * Fetches a page from the `pages` collection by slug + locale.
 * Equivalent to Next's:
 *   fetchCollectionType('pages', { filters: { slug: { $eq: slug }, locale } })
 *
 * Uses `getContentClient(draft)` so when draft mode is active the
 * `strapi-encode-source-maps` header is sent and Strapi's preview iframe
 * can click-to-select individual fields.
 *
 * Strapi's `api::page.page-populate` route middleware handles dynamic_zone
 * population server-side, so we don't pass populate.
 */
export const getPageBySlug = createServerFn({ method: 'GET' })
  .inputValidator((data: { slug: string; locale: string }) => data)
  .handler(async ({ data }) => {
    const draft = isDraftMode();
    const client = getContentClient(draft);
    const response = await client.collection('pages').find({
      filters: {
        slug: { $eq: data.slug },
      },
      locale: data.locale,
      status: draft ? 'draft' : 'published',
    });
    const pages = response.data as Array<any>;
    return { data: pages[0] ?? null };
  });
