<script setup lang="ts">
/**
 * Renders the LaunchPad globe.
 *
 * The three.js work lives in `~~/shared/globe` so Astro and Nuxt share one
 * implementation; this component is just the mount point.
 */
import { mountGlobe } from '~~/shared/globe';

const mount = ref<HTMLElement | null>(null);
let dispose: (() => void) | null = null;

onMounted(async () => {
  if (mount.value) dispose = await mountGlobe(mount.value);
});

onBeforeUnmount(() => {
  dispose?.();
  dispose = null;
});
</script>

<template>
  <div ref="mount" aria-hidden="true" />
</template>
