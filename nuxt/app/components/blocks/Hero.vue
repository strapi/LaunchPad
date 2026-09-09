<script setup lang="ts">
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

const hrefFor = (url: string | undefined, locale: string) =>
  url?.startsWith('http') ? url : `/${locale}${url ?? ''}`;
</script>

<template>
  <div
    class="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden pt-40 pb-20"
  >
    <AmbientColor />
    <Sparkles class="absolute inset-0 -z-0 h-full w-full" />

    <Container class="relative z-10 flex flex-col items-center">
      <h1
        data-reveal
        class="text-secondary mx-auto max-w-4xl bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-center text-3xl font-bold tracking-tight text-transparent text-balance md:text-6xl md:leading-tight"
      >
        {{ heading }}
      </h1>

      <p
        v-if="sub_heading"
        data-reveal
        style="--reveal-delay: 100ms"
        class="text-muted mx-auto mt-6 max-w-2xl text-center text-base md:text-lg"
      >
        {{ sub_heading }}
      </p>

      <div
        v-if="CTAs.length"
        data-reveal
        style="--reveal-delay: 200ms"
        class="mt-8 flex flex-wrap items-center justify-center gap-4"
      >
        <Button
          v-for="cta in CTAs"
          :key="cta.URL"
          :href="hrefFor(cta.URL, locale)"
          :target="cta.target"
          :variant="cta.variant ?? 'primary'"
        >
          {{ cta.text }}
        </Button>
      </div>
    </Container>
  </div>
</template>
