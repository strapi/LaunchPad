import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';
import { strapiLoader } from 'strapi-community-astro-loader';

/**
 * Astro Content Layer collections, backed by `strapi-community-astro-loader`.
 *
 * This is the idiomatic Astro way to consume a CMS: the loader pulls content
 * once per build into Astro's content store, Zod validates the shape, and pages
 * read it with `getCollection()` / `getEntry()` instead of writing fetches.
 * You get typed entries, a build-time cache, and a hard failure at build if
 * Strapi's shape drifts from what the templates expect.
 *
 * Used here for the blog, and deliberately not for everything — see the note at
 * the bottom of this file.
 */

const clientConfig = {
  baseURL: `${import.meta.env.STRAPI_URL ?? 'http://localhost:1337'}/api`,
};

/** Strapi media, as the populate middleware returns it. */
const imageSchema = z.object({
  id: z.number().optional(),
  documentId: z.string().optional(),
  url: z.string(),
  alternativeText: z.string().nullable().optional(),
  name: z.string().optional(),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
  // Media fields accept video, so this decides which element renders.
  mime: z.string().nullable().optional(),
});

/**
 * Media and relations must be `.nullable().optional()`: Strapi omits an unset
 * relation entirely and returns null for cleared media, and a schema allowing
 * only one of those fails the build on real editor data.
 */
const articleSchema = z.object({
  documentId: z.string(),
  title: z.string(),
  slug: z.string(),
  locale: z.string(),
  description: z.string().nullable().optional(),
  publishedAt: z.string().nullable().optional(),
  image: imageSchema.nullable().optional(),
  categories: z
    .array(z.object({ name: z.string() }))
    .nullable()
    .optional(),
  // Blocks and dynamic zones are open-ended by nature; the renderers narrow
  // them at the point of use rather than restating Strapi's whole schema here.
  content: z.array(z.any()).nullable().optional(),
  dynamic_zone: z.array(z.any()).nullable().optional(),
  seo: z.any().nullable().optional(),
  localizations: z
    .array(z.object({ locale: z.string(), slug: z.string() }))
    .nullable()
    .optional(),
});

/**
 * One collection per locale, rather than one collection holding both.
 *
 * Strapi 5 gives every localisation of a document the *same* `documentId`, and
 * the loader keys its store on that. Fetching `locale: '*'` into a single
 * collection therefore silently drops a translation — five API entries collapse
 * to three, and two pages vanish from the build with no error. Separate
 * collections give the keys separate namespaces.
 *
 * Populate is absent on purpose: LaunchPad's backend registers a populate
 * middleware on every API route, so a bare request already comes back fully
 * populated. Most Strapi loader examples need an explicit `populate` block.
 */
const articleCollection = (locale: string) =>
  defineCollection({
    loader: strapiLoader({
      contentType: 'article',
      clientConfig,
      params: { locale },
    }),
    schema: articleSchema,
  });

export const collections = {
  'articles-en': articleCollection('en'),
  'articles-fr': articleCollection('fr'),
};

/*
 * Why only the blog.
 *
 * The Content Layer runs at build time. That is exactly right for published
 * content and exactly wrong for draft preview, where "what does this look like
 * right now" has to be answered per request. So `/preview/[...path]` reads
 * through `src/lib/strapi.ts` directly, and pages and products do too, for
 * consistency with it.
 *
 * Showing both is the point: each is correct for a different job.
 */
