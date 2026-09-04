import { createServerFn } from '@tanstack/react-start';

import { getContentClient } from '@/data/strapi-sdk';
import { isDraftMode } from '@/lib/draft-mode';

/**
 * Fetches all products for a given locale.
 * Strapi's `api::product.product-populate` route middleware handles deep
 * population (images, plans, perks, categories, dynamic_zone) server-side.
 */
export const getProducts = createServerFn({ method: 'GET' })
  .inputValidator((data: { locale: string }) => data)
  .handler(async ({ data }) => {
    const draft = isDraftMode();
    const client = getContentClient(draft);
    const response = await client.collection('products').find({
      locale: data.locale,
      status: draft ? 'draft' : 'published',
    });
    return { data: response.data as Array<any> };
  });

/**
 * Fetches a single product by slug + locale.
 */
export const getProductBySlug = createServerFn({ method: 'GET' })
  .inputValidator((data: { slug: string; locale: string }) => data)
  .handler(async ({ data }) => {
    const draft = isDraftMode();
    const client = getContentClient(draft);
    const response = await client.collection('products').find({
      filters: { slug: { $eq: data.slug } },
      locale: data.locale,
      status: draft ? 'draft' : 'published',
    });
    const products = response.data as Array<any>;
    return { data: products[0] ?? null };
  });

/**
 * Fetches the `product-page` single type (heading, sub_heading, featured_*,
 * popular_*, seo).
 */
export const getProductPageData = createServerFn({ method: 'GET' })
  .inputValidator((data: { locale: string }) => data)
  .handler(async ({ data }) => {
    const draft = isDraftMode();
    const client = getContentClient(draft);
    const response = await client.single('product-page').find({
      locale: data.locale,
    });
    return { data: response.data as any };
  });
