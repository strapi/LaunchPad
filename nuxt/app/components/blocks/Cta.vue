<script setup lang="ts">
import { stripStegaMarkers } from '#shared/lib/stega';
import type { NavbarLink } from '#shared/types/strapi';

withDefaults(
  defineProps<{
    heading?: string;
    sub_heading?: string;
    CTAs?: Array<NavbarLink & { variant?: string }>;
    locale: string;
  }>(),
  { CTAs: () => [] }
);

// Stripped before it becomes an `href` — see `shared/lib/stega.ts`.
const hrefFor = (url: string | undefined, locale: string) => {
  const clean = stripStegaMarkers(url ?? '');
  return clean.startsWith('http') ? clean : `/${locale}${clean}`;
};
</script>

<template>
  <div class="relative overflow-hidden py-40">
    <AmbientColor />
    <Container class="relative z-10 flex flex-col items-center">
      <Heading data-reveal>{{ heading }}</Heading>
      <Subheading v-if="sub_heading" class="mt-4" data-reveal>
        {{ sub_heading }}
      </Subheading>
      <div
        v-if="CTAs.length"
        class="mt-8 flex flex-wrap items-center justify-center gap-4"
        data-reveal
      >
        <Button
          v-for="cta in CTAs"
          :key="cta.URL"
          :href="hrefFor(cta.URL, locale)"
          :target="cta.target ? stripStegaMarkers(cta.target) : undefined"
          :variant="cta.variant ?? 'primary'"
        >
          {{ cta.text }}
        </Button>
      </div>
    </Container>
  </div>
</template>
