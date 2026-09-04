<script setup lang="ts">
import type { Product } from '#shared/types/strapi';

const route = useRoute();
assertLocale(String(route.params.locale));

const locale = useLocale();
const strapi = useStrapiClient();

const { data: products } = await useAsyncData(
  computed(() => `products-${locale.value}`),
  () => strapi.collection<Product>('products', { locale: locale.value }),
  { watch: [locale], default: () => [] }
);

const { data: productPage } = await useIndexPage('product-page', locale);
const { data: global } = await useGlobal(locale);

useLaunchpadSeo({
  seo: computed(() => productPage.value?.seo),
  global,
  locale,
});
</script>

<template>
  <div class="relative overflow-hidden pt-40 pb-20">
    <AmbientColor />
    <Container class="relative z-10">
      <Heading data-reveal>{{ productPage?.heading ?? 'Products' }}</Heading>
      <Subheading v-if="productPage?.sub_heading" class="mt-4" data-reveal>
        {{ productPage.sub_heading }}
      </Subheading>

      <div
        v-if="products?.length"
        class="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4"
      >
        <ProductCard
          v-for="(product, index) in products"
          :key="product.documentId"
          :product="product"
          :locale="locale"
          :delay="index * 80"
        />
      </div>
      <p v-else class="text-muted mt-16 text-center">No products yet.</p>
    </Container>
  </div>
</template>
