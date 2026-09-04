<script setup lang="ts">
import type { Page } from '#shared/types/strapi';

/** The homepage: the CMS page whose slug is `homepage`, at the locale root. */
const route = useRoute();
assertLocale(String(route.params.locale));

const locale = useLocale();
const strapi = useStrapiClient();

const { data: page } = await useAsyncData(
  computed(() => `home-${locale.value}`),
  () => strapi.bySlug<Page>('pages', 'homepage', { locale: locale.value }),
  { watch: [locale] }
);

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true,
  });
}

const { data: global } = await useGlobal(locale);
useLaunchpadSeo({
  seo: computed(() => page.value?.seo),
  global,
  locale,
});
</script>

<template>
  <DynamicZone :zone="page?.dynamic_zone" :locale="locale" />
</template>
