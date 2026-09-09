<script setup lang="ts">
import type { NuxtError } from '#app';

/**
 * Nuxt's error page, standing in for Astro's `404.astro`.
 *
 * It renders outside the layout, so it brings its own minimal shell — a
 * navbar here would need `global`, and fetching it is exactly the sort of
 * thing that fails when you are already in an error state.
 */
const props = defineProps<{ error: NuxtError }>();

const isNotFound = computed(() => props.error?.statusCode === 404);

useHead({
  title: isNotFound.value ? 'Page not found' : 'Something went wrong',
});
</script>

<template>
  <div
    class="bg-charcoal flex min-h-screen items-center justify-center antialiased"
  >
    <div class="px-6 text-center">
      <p class="font-mono text-sm text-cyan-400">
        {{ error?.statusCode ?? 500 }}
      </p>
      <h1 class="mt-4 text-3xl font-bold text-neutral-100 md:text-4xl">
        {{ isNotFound ? 'Page not found' : 'Something went wrong' }}
      </h1>
      <p class="text-muted mt-3">
        {{
          isNotFound
            ? "We couldn't find what you're looking for."
            : 'Try again in a moment.'
        }}
      </p>
      <a
        href="/en"
        class="bg-secondary mt-8 inline-flex rounded-md px-4 py-2 text-sm font-medium text-black transition hover:bg-white"
      >
        Back home
      </a>
    </div>
  </div>
</template>
