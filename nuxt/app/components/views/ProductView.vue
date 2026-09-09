<script setup lang="ts">
import { formatPrice } from '#shared/lib/i18n';
import type { Product } from '#shared/types/strapi';

/**
 * The product detail body, shared by the prerendered route and the on-demand
 * preview route.
 *
 * The gallery is where Vue earns its keep over the Astro port: selecting a
 * thumbnail is `activeIndex`, and the main image follows. The Astro version
 * had to swap `src` by hand and toggle border classes on every button, because
 * there was no component runtime to re-render.
 */
const props = defineProps<{
  product: Product;
  locale: string;
}>();

const price = computed(() => formatPrice(props.product.price, props.locale));
const images = computed(() => props.product.images ?? []);

const activeIndex = ref(0);
const activeImage = computed(() => images.value[activeIndex.value] ?? null);

// A different product means a different gallery; without this the index could
// point past the end of the new one.
watch(
  () => props.product.documentId,
  () => {
    activeIndex.value = 0;
  }
);
</script>

<template>
  <div class="relative overflow-hidden pt-40 pb-20">
    <AmbientColor />
    <Container class="relative z-10">
      <div
        class="rounded-md bg-gradient-to-b from-neutral-900 to-neutral-950 p-4 md:p-10"
      >
        <div class="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <div class="relative overflow-hidden rounded-lg">
              <StrapiMedia
                v-if="activeImage"
                :media="activeImage"
                :alt="product.name"
                :width="600"
                :height="600"
                loading="eager"
                class="w-full rounded-lg object-cover"
              />
            </div>

            <div
              v-if="images.length > 1"
              class="mt-4 flex items-center justify-center gap-4"
            >
              <button
                v-for="(image, index) in images"
                :key="image.url"
                type="button"
                :aria-label="`Show image ${index + 1}`"
                :aria-current="index === activeIndex ? 'true' : undefined"
                class="h-20 w-20 rounded-xl border-2 bg-cover bg-center bg-no-repeat"
                :class="
                  index === activeIndex
                    ? 'border-neutral-200'
                    : 'border-transparent'
                "
                @click="activeIndex = index"
              >
                <StrapiMedia
                  :media="image"
                  alt=""
                  :width="80"
                  :height="80"
                  class="h-full w-full rounded-xl object-cover"
                />
              </button>
            </div>
          </div>

          <div>
            <h1 class="text-3xl font-bold text-neutral-100 md:text-4xl">
              {{ product.name }}
            </h1>
            <p v-if="price" class="mt-4 text-2xl text-cyan-400">{{ price }}</p>
            <p
              v-if="product.description"
              class="text-muted mt-6 leading-relaxed"
            >
              {{ product.description }}
            </p>
            <ul v-if="product.perks?.length" class="mt-8 space-y-3">
              <li
                v-for="(perk, index) in product.perks"
                :key="index"
                class="flex items-start gap-2"
              >
                <svg
                  class="mt-0.5 h-4 w-4 shrink-0 text-cyan-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12l5 5L20 7" />
                </svg>
                <span class="text-muted text-sm">{{ perk.text }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <DynamicZone
        v-if="product.dynamic_zone?.length"
        :zone="product.dynamic_zone"
        :locale="locale"
      />
    </Container>
  </div>
</template>
