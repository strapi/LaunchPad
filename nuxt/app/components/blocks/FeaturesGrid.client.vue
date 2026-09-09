<script setup lang="ts">
/**
 * Mounts the React features grid inside Vue.
 *
 * The four frontends are meant to render this section identically, and the
 * visuals depend on framer-motion, react-three-fiber and tsparticles. Rather
 * than reimplement those in Vue and drift, Nuxt runs LaunchPad's Next
 * components directly — the same files Astro uses, under app/react/.
 *
 * veaury would do this too, but its Vite plugin competes with Nuxt's own Vue
 * plugin. Mounting through createRoot is what veaury does internally, and it
 * needs no build configuration.
 *
 * `.client` suffix: this never server-renders. The React tree owns its own
 * DOM subtree, and Vue must not try to hydrate or patch inside it.
 */
import type { Root } from 'react-dom/client';

interface FeatureCard {
  title?: string | null;
  description?: string | null;
  span?: string | null;
}

const props = defineProps<{
  globe_card?: FeatureCard | null;
  ray_card?: FeatureCard | null;
  graph_card?: FeatureCard | null;
  social_media_card?: FeatureCard | null;
}>();

const host = useTemplateRef<HTMLElement>('host');
let root: Root | null = null;

onMounted(async () => {
  // The .client wrapper mounts a tick after onMounted fires, so the host
  // element is not in the DOM yet without this.
  await nextTick();
  if (!host.value) return;

  try {
    const [React, { createRoot }, mod] = await Promise.all([
      import('react'),
      import('react-dom/client'),
      import('~/react/FeaturesGrid'),
    ]);
    root = createRoot(host.value);
    // Pass the four fields explicitly. Spreading Vue's props object leaks
    // reactive internals (and any slot VNodes) into React, which rejects them
    // as invalid children.
    root.render(
      React.createElement(mod.FeaturesGrid, {
        globe_card: toRaw(props.globe_card) ?? undefined,
        ray_card: toRaw(props.ray_card) ?? undefined,
        graph_card: toRaw(props.graph_card) ?? undefined,
        social_media_card: toRaw(props.social_media_card) ?? undefined,
      })
    );
  } catch (err) {
    console.error('[FeaturesGrid] failed to mount the React island:', err);
  }
});

onBeforeUnmount(() => {
  root?.unmount();
  root = null;
});
</script>

<template>
  <div ref="host" />
</template>
