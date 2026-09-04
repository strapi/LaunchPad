<script setup lang="ts">
/*
 * Accordion built on <details>/<summary>.
 *
 * The React version used Radix Accordion. The native element already gives
 * keyboard support, focus handling and correct ARIA semantics for free, and
 * works with JavaScript disabled — no library, no reactive state.
 */
withDefaults(
  defineProps<{
    heading?: string;
    sub_heading?: string;
    faqs?: Array<{ question: string; answer: string }>;
  }>(),
  { faqs: () => [] }
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
        v-if="faqs.length"
        class="mx-auto mt-16 max-w-3xl divide-y divide-neutral-800 border-y border-neutral-800"
      >
        <details
          v-for="(faq, index) in faqs"
          :key="index"
          class="group py-5"
          name="launchpad-faq"
        >
          <summary
            class="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-medium text-neutral-100 md:text-lg"
          >
            {{ faq.question }}
            <svg
              class="h-5 w-5 shrink-0 text-neutral-400 transition-transform duration-200 group-open:rotate-45"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </summary>
          <p class="text-muted mt-3 text-sm leading-relaxed md:text-base">
            {{ faq.answer }}
          </p>
        </details>
      </div>
    </Container>
  </div>
</template>

<style scoped>
summary::-webkit-details-marker {
  display: none;
}
</style>
