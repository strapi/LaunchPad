import type { NuxtApp } from '#app';
import type { PreviewPayload } from '#shared/types/preview';
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

/**
 * The `global` single type — navbar, footer, fallback SEO.
 *
 * Published content only: this reads Strapi straight from the app, and draft
 * reads are gated by an HttpOnly cookie the browser cannot show. `/preview/**`
 * therefore does *not* use this — it takes its global out of the preview
 * payload, which the server assembles with `draft: true`. See
 * `usePreviewPayload` and `app/layouts/default.vue`.
 *
 * `enabled` is how the layout opts out on a preview route, in the same shape as
 * `useEntry` below: a disabled call resolves to null under its own `idle:` key
 * so it cannot leave a null behind the real one.
 */
export function useGlobal(locale: Ref<string>, enabled?: Ref<boolean>) {
  const strapi = useStrapiClient();
  const on = computed(() => (enabled ? enabled.value : true));

  return useAsyncData<Global | null>(
    computed(() => (on.value ? `global-${locale.value}` : 'idle:global')),
    () =>
      on.value
        ? strapi.single<Global>('global', { locale: locale.value })
        : Promise.resolve(null),
    { watch: [locale, on], ...useSharedCache<Global | null>() }
  );
}

/**
 * Everything `/preview/<locale>/<...>` renders, drafts included.
 *
 * Both the layout and the preview page need this, and the layout renders first
 * — the navbar is written before the page's `<slot>` is reached, so the page
 * cannot hand its data upwards (same constraint as `useLocalizedPaths`). They
 * call this with the same key instead and `useSharedCache` collapses the two
 * into one request, so the draft global that feeds the navbar and footer is the
 * same object the page renders from.
 *
 * It goes through `/api/preview-content` rather than Strapi directly because
 * the draft cookie is HttpOnly: only the server can see whether this request is
 * allowed to read unpublished content, and only the server may ask for source
 * maps on its behalf.
 */
export function usePreviewPayload(path: Ref<string>, enabled?: Ref<boolean>) {
  const on = computed(() => (enabled ? enabled.value : true));

  return useAsyncData<PreviewPayload | null>(
    computed(() => (on.value ? `preview-${path.value}` : 'idle:preview')),
    () =>
      on.value
        ? $fetch<PreviewPayload>('/api/preview-content', {
            query: { path: path.value },
            headers: useRequestHeaders(['cookie']),
          })
        : Promise.resolve(null),
    { watch: [path, on], ...useSharedCache<PreviewPayload | null>() }
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
