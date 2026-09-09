<script setup lang="ts">
import type { StrapiMedia as Media } from '#shared/types/strapi';

/*
 * Two-row testimonial marquee, matching LaunchPad's layout. The rows scroll in
 * opposite directions via one CSS animation and a reversed direction, rather
 * than the React version's per-item framer-motion transforms.
 */
interface Testimonial {
  text: string;
  user?: {
    firstname?: string;
    lastname?: string;
    job?: string;
    image?: Media | null;
  } | null;
}

const props = withDefaults(
  defineProps<{
    heading?: string;
    sub_heading?: string;
    testimonials?: Testimonial[];
  }>(),
  { testimonials: () => [] }
);

const rows = computed<Testimonial[][]>(() => {
  const all = props.testimonials;
  if (all.length <= 3) return [all];
  const half = Math.ceil(all.length / 2);
  return [all.slice(0, half), all.slice(half)];
});

const fullName = (user: Testimonial['user']) =>
  `${user?.firstname ?? ''} ${user?.lastname ?? ''}`.trim();
</script>

<template>
  <div class="relative py-20">
    <Container>
      <Heading data-reveal>{{ heading }}</Heading>
      <Subheading v-if="sub_heading" class="mt-4" data-reveal>
        {{ sub_heading }}
      </Subheading>
    </Container>

    <div v-if="testimonials.length" class="mt-16 space-y-6">
      <div
        v-for="(row, rowIndex) in rows"
        :key="rowIndex"
        class="marquee flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      >
        <div
          v-for="isClone in [false, true]"
          :key="String(isClone)"
          class="marquee__track flex shrink-0 gap-6 px-3"
          :class="rowIndex % 2 === 1 && 'marquee__track--reverse'"
          :aria-hidden="isClone ? 'true' : undefined"
        >
          <figure
            v-for="(item, index) in row"
            :key="index"
            class="w-[22rem] shrink-0 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6"
          >
            <blockquote class="text-muted text-sm leading-relaxed">
              {{ item.text }}
            </blockquote>
            <figcaption class="mt-4 flex items-center gap-3">
              <StrapiMedia
                v-if="item.user?.image"
                :media="item.user.image"
                :alt="fullName(item.user)"
                :width="40"
                :height="40"
                class="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p class="text-sm font-medium text-neutral-200">
                  {{ item.user?.firstname }} {{ item.user?.lastname }}
                </p>
                <p v-if="item.user?.job" class="text-xs text-neutral-500">
                  {{ item.user.job }}
                </p>
              </div>
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.marquee__track {
  animation: var(--animate-marquee);
  animation-duration: 60s;
}
.marquee__track--reverse {
  animation-direction: reverse;
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
