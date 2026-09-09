<script setup lang="ts">
withDefaults(
  defineProps<{
    heading?: string;
    sub_heading?: string;
    steps?: Array<{ title: string; description: string }>;
  }>(),
  { steps: () => [] }
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
        v-if="steps.length"
        class="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        <div
          v-for="(step, index) in steps"
          :key="index"
          data-reveal
          :style="`--reveal-delay: ${index * 80}ms`"
          class="group relative rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 transition duration-200 hover:border-neutral-700"
        >
          <span
            class="text-secondary inline-flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800 text-sm font-semibold shadow-[0px_1px_0px_0px_var(--color-neutral-600)_inset]"
          >
            {{ String(index + 1).padStart(2, '0') }}
          </span>
          <h3 class="mt-5 text-lg font-semibold text-neutral-100">
            {{ step.title }}
          </h3>
          <p class="text-muted mt-2 text-sm leading-relaxed">
            {{ step.description }}
          </p>
        </div>
      </div>
    </Container>
  </div>
</template>
