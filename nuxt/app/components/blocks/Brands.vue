<script setup lang="ts">
import type { StrapiMedia as Media } from '#shared/types/strapi';

/*
 * Logo marquee. Replaces `react-fast-marquee` with a CSS animation over a
 * duplicated track — the second copy is aria-hidden so screen readers and the
 * accessibility tree only see each logo once.
 */
withDefaults(
  defineProps<{
    heading?: string;
    sub_heading?: string;
    logos?: Array<{ image?: Media | null }>;
  }>(),
  { logos: () => [] }
);
</script>

<template>
  <div class="relative py-20">
    <Container>
      <Heading data-reveal>{{ heading }}</Heading>
      <Subheading v-if="sub_heading" class="mt-4" data-reveal>
        {{ sub_heading }}
      </Subheading>
    </Container>

    <div
      v-if="logos.length"
      class="marquee mt-16 flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
    >
      <div
        v-for="isClone in [false, true]"
        :key="String(isClone)"
        class="marquee__track flex shrink-0 items-center gap-16 px-8"
        :aria-hidden="isClone ? 'true' : undefined"
      >
        <StrapiMedia
          v-for="(logo, index) in logos"
          :key="index"
          :media="logo.image"
          :alt="logo.image?.alternativeText ?? ''"
          :width="400"
          :height="400"
          class="h-10 w-40 object-contain md:h-20 md:w-60"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.marquee__track {
  animation: var(--animate-marquee);
}
.marquee:hover .marquee__track {
  animation-play-state: paused;
}
@media (prefers-reduced-motion: reduce) {
  .marquee__track {
    animation: none;
  }
}
</style>
