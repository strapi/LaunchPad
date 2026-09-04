<script setup lang="ts">
/**
 * Hero particle field.
 *
 * The original uses `@tsparticles/react`; tsparticles itself is framework
 * agnostic, so the vanilla `tsParticles.load()` API gives the same effect
 * without the React wrapper.
 *
 * Deferred behind `requestIdleCallback` and skipped entirely when the user
 * prefers reduced motion — it is pure decoration, so it should never compete
 * with content for the main thread. The dynamic import keeps the engine out of
 * the main bundle.
 */
const el = ref<HTMLElement | null>(null);
const id = `sparkles-${useId()}`;

let loaded = false;
/** Held so unmount destroys *this* instance, not whichever loaded first. */
let container: { destroy: () => void } | undefined;

async function mountSparkles() {
  if (loaded || !el.value) return;
  loaded = true;

  const [{ tsParticles }, { loadSlim }] = await Promise.all([
    import('@tsparticles/engine'),
    import('@tsparticles/slim'),
  ]);

  await loadSlim(tsParticles);

  container = await tsParticles.load({
    id,
    options: {
      fullScreen: { enable: false },
      background: { color: { value: 'transparent' } },
      fpsLimit: 60,
      detectRetina: true,
      particles: {
        number: { value: 60, density: { enable: true } },
        color: { value: '#FFFFFF' },
        opacity: {
          value: { min: 0.1, max: 0.8 },
          animation: { enable: true, speed: 1, sync: false },
        },
        size: { value: { min: 0.6, max: 1.6 } },
        move: { enable: true, speed: 0.4, direction: 'none', random: true },
        links: { enable: false },
      },
    },
  });
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => void mountSparkles(), { timeout: 2000 });
  } else {
    setTimeout(() => void mountSparkles(), 500);
  }
});

onBeforeUnmount(() => {
  // Leaving the page must stop the rAF loop, or it keeps running against a
  // canvas that is no longer in the document.
  container?.destroy();
  container = undefined;
});
</script>

<template>
  <div :id="id" ref="el" class="pointer-events-none" aria-hidden="true" />
</template>
