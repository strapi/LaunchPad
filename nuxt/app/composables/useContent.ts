import type { NuxtApp } from '#app';
import type {
  Article,
  Global,
  IndexPage,
  Page,
  Product,
} from '#shared/types/strapi';

/**
 * Shared content reads.
 *
 * Every fetch a page makes lives here rather than in the page, because the
 * layout needs some of the same data and the two must agree on the cache key.
 * `useAsyncData` dedupes by key within a render, so when the layout and the
 * page ask for the same entry it is fetched once — see `useLocalizedPaths`.
 *
 * Keys are reactive getters, so switching locale refetches instead of showing
 * the previous locale's content until a hard reload.
 */

/**
 * Reuse a result already fetched under the same key, on the server as well as
 * the client.
 *
 * This is what actually makes the sharing work. Nuxt's default `getCachedData`
 * only consults the payload while hydrating, so during SSR the layout's fetch
 * and the page's fetch of the same key each hit Strapi — the key matching buys
 * nothing. Making the payload authoritative in both places collapses them to
 * one request.
 *
 * Safe here because everything below is read-only CMS content for the current
 * render. An explicit `refresh()` — which is what the `watch` options trigger
 * on a locale change — bypasses this and refetches.
 */
const useSharedCache = <T>() => ({
  getCachedData: (key: string, nuxtApp: NuxtApp): T | undefined =>
    (nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]) as T | undefined,
});

export function useGlobal(locale: Ref<string>) {
  const strapi = useStrapiClient();

  return useAsyncData(
    computed(() => `global-${locale.value}`),
    () => strapi.single<Global>('global', { locale: locale.value }),
    { watch: [locale], ...useSharedCache<Global>() }
  );
}

/**
 * A landing single type (`blog-page`, `product-page`).
 *
 * Missing or unpublished is not an error here — the index still renders, just
 * without its authored heading — so a failure resolves to null rather than
 * taking the page down with it.
 */
export function useIndexPage(singleType: string, locale: Ref<string>) {
  const strapi = useStrapiClient();

  return useAsyncData(
    computed(() => `${singleType}-${locale.value}`),
    () =>
      strapi
        .single<IndexPage>(singleType, { locale: locale.value })
        .catch(() => null),
    {
      watch: [locale],
      default: () => null,
      ...useSharedCache<IndexPage | null>(),
    }
  );
}

/**
 * The three entry lookups.
 *
 * `enabled` exists for `useLocalizedPaths`, which calls all three from the
 * layout and only wants the one matching the current route to fire. A disabled
 * call resolves to null under its own `idle:` key — deliberately *not* the real
 * one, so it cannot leave a null in the cache that the page would then read
 * back instead of its content.
 */
function useEntry<T>(
  kind: string,
  collection: string,
  locale: Ref<string>,
  slug: Ref<string>,
  enabled?: Ref<boolean>
) {
  const strapi = useStrapiClient();
  const on = computed(() => (enabled ? enabled.value : true));

  return useAsyncData<T | null>(
    computed(() =>
      on.value ? `${kind}-${locale.value}-${slug.value}` : `idle:${kind}`
    ),
    () =>
      on.value
        ? strapi.bySlug<T>(collection, slug.value, { locale: locale.value })
        : Promise.resolve(null),
    { watch: [locale, slug, on], ...useSharedCache<T | null>() }
  );
}

export const useArticle = (
  locale: Ref<string>,
  slug: Ref<string>,
  enabled?: Ref<boolean>
) => useEntry<Article>('article', 'articles', locale, slug, enabled);

export const useProduct = (
  locale: Ref<string>,
  slug: Ref<string>,
  enabled?: Ref<boolean>
) => useEntry<Product>('product', 'products', locale, slug, enabled);

export const useCmsPage = (
  locale: Ref<string>,
  slug: Ref<string>,
  enabled?: Ref<boolean>
) => useEntry<Page>('page', 'pages', locale, slug, enabled);
