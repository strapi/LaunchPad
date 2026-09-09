import { isLocale } from '#shared/lib/i18n';
import type { PreviewPayload, PreviewResolved } from '#shared/types/preview';
import type {
  Article,
  Global,
  IndexPage,
  Page,
  Product,
} from '#shared/types/strapi';

/**
 * Resolves the draft content behind `/preview/<locale>/<...>`.
 *
 * This lives on the server rather than in the page for two reasons: the draft
 * cookie is HttpOnly, so only the server can see it, and draft content must
 * never be fetchable straight from the browser — the gate would be worthless
 * if the page asked Strapi for `status=draft` itself.
 *
 * The page calls this through `useAsyncData`, so during SSR it runs in-process
 * with no network hop.
 */

export default defineEventHandler(async (event): Promise<PreviewPayload> => {
  const rawPath = getQuery(event).path;
  const segments = (typeof rawPath === 'string' ? rawPath : '')
    .split('/')
    .filter(Boolean);
  const [locale, ...rest] = segments;

  const allowed = isDraftMode(event) && isLocale(locale);
  const safeLocale = isLocale(locale) ? locale : 'en';

  if (!allowed) {
    // Nothing is fetched and nothing is disclosed — landing here without going
    // through `/api/preview` looks the same as a page that does not exist.
    return { allowed: false, locale: safeLocale, global: null, resolved: null };
  }

  const strapi = useStrapi();
  const draft = { locale: safeLocale, draft: true } as const;

  const global = await strapi.single<Global>('global', {
    locale: safeLocale,
    draft: true,
  });

  const resolved = await resolve();

  return { allowed: true, locale: safeLocale, global, resolved };

  async function resolve(): Promise<PreviewResolved> {
    // Named up front so the branches below read as routes rather than indices.
    // `section` is the first segment after the locale, `entry` the slug.
    const [section, entry] = rest;

    // /en — nothing after the locale means the homepage.
    if (!section) {
      const page = await strapi.bySlug<Page>('pages', 'homepage', draft);
      return page ? { kind: 'page', page } : null;
    }

    // /en/blog and /en/blog/<slug>
    if (section === 'blog') {
      if (!entry) {
        const [articles, blogPage] = await Promise.all([
          strapi.collection<Article>('articles', {
            ...draft,
            sort: 'publishedAt:desc',
          }),
          strapi.single<IndexPage>('blog-page', draft).catch(() => null),
        ]);
        return { kind: 'blog-index', articles, heading: blogPage?.heading };
      }
      const article = await strapi.bySlug<Article>('articles', entry, draft);
      return article ? { kind: 'article', article } : null;
    }

    // /en/products and /en/products/<slug>
    if (section === 'products') {
      if (!entry) {
        const [products, productPage] = await Promise.all([
          strapi.collection<Product>('products', draft),
          strapi.single<IndexPage>('product-page', draft).catch(() => null),
        ]);
        return {
          kind: 'product-index',
          products,
          heading: productPage?.heading,
        };
      }
      const product = await strapi.bySlug<Product>('products', entry, draft);
      return product ? { kind: 'product', product } : null;
    }

    // /en/<slug> — any other CMS-driven page
    const page = await strapi.bySlug<Page>('pages', section, draft);
    return page ? { kind: 'page', page } : null;
  }
});
