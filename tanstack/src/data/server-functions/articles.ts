import { createServerFn } from '@tanstack/react-start';

import { getContentClient } from '@/data/strapi-sdk';
import { isDraftMode } from '@/lib/draft-mode';

/**
 * Fetches all articles for a given locale.
 * Matches the Next launchpad's behavior: returns the full list so the
 * client can do fuzzy-search filtering in the list page.
 *
 * Intentionally mirrors Next's query shape — only `filters.locale: { $eq }`,
 * no explicit sort — so the article order (and therefore which article shows
 * as the featured "first" card) matches Next exactly.
 *
 * Strapi's `api::article.article-populate` route middleware handles deep
 * population server-side.
 */
export const getArticles = createServerFn({ method: 'GET' })
  .inputValidator((data: { locale: string }) => data)
  .handler(async ({ data }) => {
    const draft = isDraftMode();
    const client = getContentClient(draft);
    const response = await client.collection('articles').find({
      filters: { locale: { $eq: data.locale } },
      locale: data.locale,
      status: draft ? 'draft' : 'published',
    });
    return { data: response.data as Array<any> };
  });

/**
 * Fetches a single article by slug + locale.
 */
export const getArticleBySlug = createServerFn({ method: 'GET' })
  .inputValidator((data: { slug: string; locale: string }) => data)
  .handler(async ({ data }) => {
    const draft = isDraftMode();
    const client = getContentClient(draft);
    const response = await client.collection('articles').find({
      filters: { slug: { $eq: data.slug } },
      locale: data.locale,
      status: draft ? 'draft' : 'published',
    });
    const articles = response.data as Array<any>;
    return { data: articles[0] ?? null };
  });

/**
 * Fetches the `blog-page` single type (heading, sub_heading, seo).
 */
export const getBlogPageData = createServerFn({ method: 'GET' })
  .inputValidator((data: { locale: string }) => data)
  .handler(async ({ data }) => {
    const draft = isDraftMode();
    const client = getContentClient(draft);
    const response = await client.single('blog-page').find({
      locale: data.locale,
    });
    return { data: response.data as any };
  });
