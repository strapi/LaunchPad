import { strapiMedia } from '#shared/lib/media';
import type { Global, Seo } from '#shared/types/strapi';

/**
 * Page metadata, resolved from Strapi's SEO component.
 *
 * Every page has its own `seo`, and the `global` single type carries the
 * site-wide fallback. Both are usually still loading when this runs, so the
 * inputs are refs and `useSeoMeta` is given getters — it re-renders the tags
 * when the data lands, which matters because the prerenderer serialises the
 * head after the page's async data resolves.
 */
export function useLaunchpadSeo(options: {
  seo: Ref<Seo | null | undefined>;
  global: Ref<Global | null | undefined>;
  locale: Ref<string>;
}) {
  const { seo, global, locale } = options;
  const strapiUrl = useStrapiUrl();
  const siteUrl = useRuntimeConfig().public.siteUrl;
  const route = useRoute();

  const fallback = computed(() => global.value?.seo ?? null);

  const title = computed(
    () => seo.value?.metaTitle || fallback.value?.metaTitle || 'LaunchPad'
  );
  const description = computed(
    () =>
      seo.value?.metaDescription ||
      fallback.value?.metaDescription ||
      'The official Strapi demo application.'
  );
  const image = computed(() =>
    strapiMedia(
      seo.value?.metaImage?.url ?? fallback.value?.metaImage?.url,
      strapiUrl
    )
  );
  const canonical = computed(() => new URL(route.path, siteUrl).href);

  useHead({
    htmlAttrs: { lang: locale },
    link: [{ rel: 'canonical', href: canonical }],
  });

  useSeoMeta({
    title,
    description,
    ogTitle: () => seo.value?.ogTitle || title.value,
    ogDescription: () => seo.value?.ogDescription || description.value,
    ogType: 'website',
    ogUrl: canonical,
    ogImage: () => image.value ?? undefined,
    twitterCard: () =>
      (seo.value?.twitterCard as 'summary_large_image') ||
      'summary_large_image',
    twitterTitle: () => seo.value?.twitterTitle || title.value,
    twitterDescription: () =>
      seo.value?.twitterDescription || description.value,
    twitterImage: () => seo.value?.twitterImage ?? undefined,
  });
}
