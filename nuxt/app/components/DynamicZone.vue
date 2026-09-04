<script setup lang="ts">
import type { DynamicZoneEntry } from '#shared/types/strapi';
/**
 * Renders a Strapi dynamic zone.
 *
 * The blocks are imported statically rather than through Nuxt's auto-import,
 * because the registry below maps Strapi's `__component` string to a component
 * — that lookup needs real references, not names resolved at compile time.
 *
 * The React version lazy-loaded each block with `next/dynamic`. Here they are
 * plain imports: these are the blocks that make up a LaunchPad page, so nearly
 * all of them are on the homepage anyway and splitting them would cost a
 * request each rather than saving one.
 *
 * An unknown `__component` is skipped with a warning rather than throwing, so
 * adding a block in Strapi degrades to a gap in the page instead of a failed
 * build.
 */
import type { Component } from 'vue';

import Brands from './blocks/Brands.vue';
import Cta from './blocks/Cta.vue';
import Faq from './blocks/Faq.vue';
import Features from './blocks/Features.vue';
import FormNextToSection from './blocks/FormNextToSection.vue';
import Hero from './blocks/Hero.vue';
import HowItWorks from './blocks/HowItWorks.vue';
import Launches from './blocks/Launches.vue';
import Pricing from './blocks/Pricing.vue';
import RelatedArticles from './blocks/RelatedArticles.vue';
import RelatedProducts from './blocks/RelatedProducts.vue';
import Testimonials from './blocks/Testimonials.vue';

const props = defineProps<{
  zone?: DynamicZoneEntry[] | null;
  locale: string;
}>();

const REGISTRY: Record<string, Component> = {
  'dynamic-zone.hero': Hero,
  'dynamic-zone.features': Features,
  'dynamic-zone.testimonials': Testimonials,
  'dynamic-zone.how-it-works': HowItWorks,
  'dynamic-zone.brands': Brands,
  'dynamic-zone.pricing': Pricing,
  'dynamic-zone.launches': Launches,
  'dynamic-zone.cta': Cta,
  'dynamic-zone.faq': Faq,
  'dynamic-zone.form-next-to-section': FormNextToSection,
  'dynamic-zone.related-articles': RelatedArticles,
  'dynamic-zone.related-products': RelatedProducts,
};

const blocks = computed(() =>
  (props.zone ?? []).map((entry) => ({
    entry,
    component: REGISTRY[entry.__component],
  }))
);

watchEffect(() => {
  for (const { entry, component } of blocks.value) {
    if (!component) {
      console.warn(`[DynamicZone] No renderer for "${entry.__component}"`);
    }
  }
});
</script>

<template>
  <div>
    <template v-for="({ entry, component }, i) in blocks" :key="entry.id ?? i">
      <component
        :is="component"
        v-if="component"
        v-bind="entry"
        :locale="locale"
      />
    </template>
  </div>
</template>
