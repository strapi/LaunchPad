<script setup lang="ts">
const route = useRoute();
assertLocale(String(route.params.locale));

const locale = useLocale();
const slug = computed(() => String(route.params.slug));

const { data: product } = await useProduct(locale, slug);

if (!product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Product not found',
    fatal: true,
  });
}

const { data: global } = await useGlobal(locale);
useLaunchpadSeo({
  seo: computed(() => product.value?.seo),
  global,
  locale,
});
</script>

<template>
  <ProductView v-if="product" :product="product" :locale="locale" />
</template>
