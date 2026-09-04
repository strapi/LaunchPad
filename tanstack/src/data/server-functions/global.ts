import { createServerFn } from '@tanstack/react-start';

import { getContentClient } from '@/data/strapi-sdk';
import { isDraftMode } from '@/lib/draft-mode';

/**
 * Fetches the Strapi `global` single type (navbar, footer, seo).
 *
 * Uses `getContentClient(draft)` so navbar/footer text becomes clickable
 * in the Strapi preview iframe when draft mode is active.
 *
 * Strapi's `api::global.global-populate` route middleware (if configured) handles
 * deep population server-side, so we don't pass populate from the client.
 */
export const getGlobalData = createServerFn({ method: 'GET' })
  .inputValidator((data: { locale: string }) => data)
  .handler(async ({ data }) => {
    const draft = isDraftMode();
    const client = getContentClient(draft);
    const response = await client.single('global').find({
      locale: data.locale,
    });
    return { data: response.data as any };
  });
