<script setup lang="ts">
import { formatPrice } from '#shared/lib/i18n';
import type { Product } from '#shared/types/strapi';

const props = withDefaults(
  defineProps<{
    product: Product;
    locale: string;
    delay?: number;
  }>(),
  { delay: 0 }
);

const price = computed(() => formatPrice(props.product.price, props.locale));
</script>

<template>
  <NuxtLink
    :to="`/${locale}/products/${product.slug}`"
    data-reveal
    :style="`--reveal-delay: ${delay}ms`"
    class="group flex flex-col overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/50 transition duration-200 hover:border-neutral-700"
  >
    <div class="aspect-square w-full overflow-hidden bg-neutral-900">
      <StrapiMedia
        v-if="product.images?.[0]"
        :media="product.images[0]"
        :alt="product.name"
        :width="600"
        :height="600"
        class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
      />
    </div>
    <div class="flex flex-1 flex-col p-5">
      <h3 class="text-base font-semibold text-neutral-100">
        {{ product.name }}
      </h3>
      <p v-if="price" class="mt-2 text-sm text-cyan-400">{{ price }}</p>
    </div>
  </NuxtLink>
</template>
