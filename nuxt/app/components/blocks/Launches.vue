<script setup lang="ts">
withDefaults(
  defineProps<{
    heading?: string;
    sub_heading?: string;
    launches?: Array<{
      mission_number: string;
      title: string;
      description: string;
    }>;
  }>(),
  { launches: () => [] }
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
        v-if="launches.length"
        class="mx-auto mt-16 max-w-4xl divide-y divide-neutral-800 border-y border-neutral-800"
      >
        <div
          v-for="(launch, index) in launches"
          :key="index"
          data-reveal
          :style="`--reveal-delay: ${index * 60}ms`"
          class="grid grid-cols-1 gap-2 py-6 md:grid-cols-[8rem_1fr]"
        >
          <span class="font-mono text-sm text-cyan-400">
            {{ launch.mission_number }}
          </span>
          <div>
            <h3 class="text-base font-semibold text-neutral-100 md:text-lg">
              {{ launch.title }}
            </h3>
            <p class="text-muted mt-1 text-sm leading-relaxed">
              {{ launch.description }}
            </p>
          </div>
        </div>
      </div>
    </Container>
  </div>
</template>
