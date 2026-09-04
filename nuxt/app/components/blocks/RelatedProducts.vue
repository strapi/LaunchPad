<script setup lang="ts">
import type { Product } from '#shared/types/strapi';

withDefaults(
  defineProps<{
    heading?: string;
    sub_heading?: string;
    products?: Product[];
    locale: string;
  }>(),
  { products: () => [] }
);
</script>

<template>
  <div class="relative py-20">
    <Container>
      <Heading data-reveal>{{ heading }}</Heading>
      <Subheading v-if="sub_heading" class="mt-4" data-reveal>
        {{ sub_heading }}
      </Subheading>
      <div
        v-if="products.length"
        class="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4"
      >
        <ProductCard
          v-for="(product, index) in products"
          :key="product.documentId ?? index"
          :product="product"
          :locale="locale"
          :delay="index * 80"
        />
      </div>
    </Container>
  </div>
</template>
