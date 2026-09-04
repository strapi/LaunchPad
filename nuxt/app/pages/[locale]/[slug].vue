<script setup lang="ts">
/*
 * CMS-driven pages: /pricing, /contact, /faq and anything else an editor adds.
 *
 * `homepage` is excluded because it renders at the locale root instead —
 * without this, `/en/homepage` would be a second copy of the front page.
 *
 * Static route files (`sign-in.vue`, `blog/`, `products/`) take precedence over
 * this one in Nuxt's router, so those never fall through to here.
 */
const route = useRoute();
assertLocale(String(route.params.locale));

const locale = useLocale();
const slug = computed(() => String(route.params.slug));

if (slug.value === 'homepage') {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true,
  });
}

const { data: page } = await useCmsPage(locale, slug);

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
