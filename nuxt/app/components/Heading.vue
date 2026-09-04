<script setup lang="ts">
withDefaults(defineProps<{ as?: 'h1' | 'h2' | 'h3' }>(), { as: 'h2' });
</script>

<template>
  <component
    :is="as"
    class="text-secondary bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-center text-2xl font-semibold tracking-tight text-transparent md:text-4xl md:leading-tight"
  >
    <slot />
  </component>
</template>
