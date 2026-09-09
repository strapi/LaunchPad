import { isLocale, localizedPaths } from '#shared/lib/i18n';

/**
 * Where the locale switcher should point for the current page.
 *
 * Translated entries have different slugs — `/en/blog/foo` is
 * `/fr/blog/quelque-chose`, not `/fr/blog/foo` — so swapping the locale
 * segment is wrong for anything backed by a localised Strapi entry, and sends
 * visitors (and the prerender crawler) to a 404.
 *
 * The switcher lives in the navbar, which is in the layout. During SSR the
 * layout's template renders the navbar *before* it reaches the page's `<slot>`,
 * so anything the page publishes — via state, provide/inject, or a store —
 * arrives after the links have already been written. Passing it down as a prop
 * has the same problem: there is nothing to pass yet.
 *
 * So the layout resolves it itself, from the route. That sounds like a second
 * fetch and is not one: these go through the same `useContent` helpers the page
 * uses, with the same cache keys, so `useAsyncData` returns the layout's result
 * to the page rather than asking Strapi twice.
 */

/** Segments under `[locale]` that are real routes, not CMS page slugs. */
const RESERVED = new Set(['blog', 'products', 'sign-in', 'sign-up']);

export function useRouteLocalizedPaths(): Ref<
  Record<string, string> | undefined
> {
  const route = useRoute();

  const segments = computed(() => route.path.split('/').filter(Boolean));
  const locale = computed(() => segments.value[0] ?? '');
  const section = computed(() => segments.value[1] ?? '');
  const entry = computed(() => segments.value[2] ?? '');

  /*
   * Which kind of entry this path points at, if any. Index routes and the auth
   * pages resolve to null and fall back to the plain segment swap, which is
   * correct for them — their paths are the same in every locale.
   */
  const kind = computed<'article' | 'product' | 'page' | null>(() => {
    if (!isLocale(locale.value)) return null;
    if (section.value === 'blog') return entry.value ? 'article' : null;
    if (section.value === 'products') return entry.value ? 'product' : null;
    if (section.value && !entry.value && !RESERVED.has(section.value)) {
      return 'page';
    }
    return null;
  });

  // The slug being viewed, whichever collection it belongs to.
  const slug = computed(() =>
    kind.value === 'page' ? section.value : entry.value
  );

  /*
   * All three run, and only the matching one has a slug to look up. The others
   * are handed an empty slug, which `enabled: false` stops from ever firing —
   * composables cannot be called conditionally.
   */
  const active = (want: string) =>
    computed(() => kind.value === want && !!slug.value);

  const { data: article } = useArticle(locale, slug, active('article'));
  const { data: product } = useProduct(locale, slug, active('product'));
  const { data: page } = useCmsPage(locale, slug, active('page'));

  return computed(() => {
    switch (kind.value) {
      case 'article':
        return article.value
          ? localizedPaths(
              locale.value,
              article.value.slug,
              article.value.localizations,
              'blog'
            )
          : undefined;
      case 'product':
        return product.value
          ? localizedPaths(
              locale.value,
              product.value.slug,
              product.value.localizations,
              'products'
            )
          : undefined;
      case 'page':
        return page.value
          ? localizedPaths(
              locale.value,
              page.value.slug,
              page.value.localizations
            )
          : undefined;
      default:
        return undefined;
    }
  });
}
