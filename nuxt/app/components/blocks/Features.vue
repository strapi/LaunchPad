<script setup lang="ts">
/*
 * The four feature cards. In LaunchPad each carries an Aceternity effect;
 * the globe is the signature one and is ported to vanilla three.js, while the
 * ray / graph / social cards use CSS gradients and SVG instead of their
 * canvas-shader originals.
 */
interface Card {
  title?: string;
  description?: string;
}

defineProps<{
  heading?: string;
  sub_heading?: string;
  globe_card?: Card;
  ray_card?: Card;
  graph_card?: Card;
  social_media_card?: Card;
}>();

/**
 * Card widths come from Strapi's `span` field ("one" | "two" | "three"), the
 * same field the Next frontend reads. Classes are spelled out rather than
 * interpolated so Tailwind can see them.
 */
const SPAN: Record<string, string> = {
  one: 'lg:col-span-1',
  two: 'lg:col-span-2',
  three: 'lg:col-span-3',
};
const spanClass = (span?: string, fallback = 'lg:col-span-1') =>
  (span && SPAN[span]) || fallback;
</script>

<template>
  <div class="relative py-20">
    <Container>
      <Heading data-reveal>{{ heading }}</Heading>
      <Subheading v-if="sub_heading" class="mt-4" data-reveal>
        {{ sub_heading }}
      </Subheading>

      <div class="mt-16 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div
          v-if="globe_card"
          data-reveal
          :class="[
            'group overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6',
            spanClass(globe_card.span, 'lg:col-span-2'),
          ]"
        >
          <h3 class="text-lg font-semibold text-neutral-100">
            {{ globe_card.title }}
          </h3>
          <p class="text-muted mt-2 text-sm">{{ globe_card.description }}</p>
          <div class="relative mt-6 h-72 w-full overflow-hidden lg:h-[26rem]">
            <GlobeScene />
          </div>
        </div>

        <div
          v-if="ray_card"
          data-reveal
          style="--reveal-delay: 80ms"
          :class="[
            'relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6',
            spanClass(ray_card.span),
          ]"
        >
          <h3 class="text-lg font-semibold text-neutral-100">
            {{ ray_card.title }}
          </h3>
          <p class="text-muted mt-2 text-sm">{{ ray_card.description }}</p>
          <div
            class="relative mt-6 h-40 overflow-hidden rounded-xl bg-neutral-950"
          >
            <div class="ray absolute inset-y-0 -left-1/2 w-1/2 opacity-60" />
            <div
              class="relative flex h-full flex-col justify-center gap-2 px-5 text-sm"
            >
              <p class="text-neutral-300">
                <span
                  class="rounded-md bg-neutral-800 px-1.5 py-0.5 font-medium text-white"
                  >2,052</span
                >
                satellites
              </p>
              <p class="text-neutral-300">
                <span
                  class="rounded-md bg-neutral-800 px-1.5 py-0.5 font-medium text-white"
                  >8,230,002</span
                >
                payloads
              </p>
              <p class="text-neutral-300">
                <span
                  class="rounded-md bg-neutral-800 px-1.5 py-0.5 font-medium text-white"
                  >7,224</span
                >
                rockets
              </p>
            </div>
          </div>
        </div>

        <div
          v-if="graph_card"
          data-reveal
          style="--reveal-delay: 160ms"
          :class="[
            'rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6',
            spanClass(graph_card.span),
          ]"
        >
          <h3 class="text-lg font-semibold text-neutral-100">
            {{ graph_card.title }}
          </h3>
          <p class="text-muted mt-2 text-sm">{{ graph_card.description }}</p>
          <div class="mt-6 flex items-start gap-10">
            <div>
              <p class="text-xl font-medium text-neutral-100">6,092</p>
              <p class="text-xs text-neutral-500">Last Month</p>
            </div>
            <div>
              <p class="text-xl font-medium text-neutral-100">72K</p>
              <p class="text-xs text-neutral-500">Modules delivered</p>
            </div>
          </div>
          <p class="mt-4 text-sm text-neutral-300">
            <span
              class="rounded-md bg-neutral-800 px-1.5 py-0.5 font-medium text-white"
              >+8,008</span
            >
            launched
          </p>
          <svg
            viewBox="0 0 300 120"
            class="mt-6 h-40 w-full"
            role="img"
            aria-label="Growth chart"
          >
            <defs>
              <linearGradient id="graph-fill" x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="0%"
                  stop-color="var(--color-cyan-500)"
                  stop-opacity="0.4"
                />
                <stop
                  offset="100%"
                  stop-color="var(--color-cyan-500)"
                  stop-opacity="0"
                />
              </linearGradient>
            </defs>
            <path
              d="M0 100 L50 82 L100 88 L150 54 L200 62 L250 26 L300 12 L300 120 L0 120 Z"
              fill="url(#graph-fill)"
            />
            <path
              d="M0 100 L50 82 L100 88 L150 54 L200 62 L250 26 L300 12"
              fill="none"
              stroke="var(--color-cyan-400)"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <div
          v-if="social_media_card"
          data-reveal
          style="--reveal-delay: 240ms"
          :class="[
            'rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6',
            spanClass(social_media_card.span, 'lg:col-span-2'),
          ]"
        >
          <h3 class="text-lg font-semibold text-neutral-100">
            {{ social_media_card.title }}
          </h3>
          <p class="text-muted mt-2 text-sm">
            {{ social_media_card.description }}
          </p>
          <SocialIcons />
        </div>
      </div>
    </Container>
  </div>
</template>

<style scoped>
.ray {
  background: linear-gradient(
    90deg,
    transparent,
    var(--color-cyan-400),
    transparent
  );
  animation: sweep 4s linear infinite;
}
@keyframes sweep {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(400%);
  }
}
@media (prefers-reduced-motion: reduce) {
  .ray {
    animation: none;
  }
}
</style>
