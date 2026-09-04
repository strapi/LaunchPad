<script setup lang="ts">
/**
 * Wraps `text` in each tag in turn, outermost first.
 *
 * Recursion is what makes an arbitrary combination of marks work without
 * writing out every pairing: `['strong','em']` renders `<strong><em>…`.
 */
defineProps<{ tags: string[]; text: string }>();
</script>

<template>
  <component :is="tags[0]">
    <BlocksMarks v-if="tags.length > 1" :tags="tags.slice(1)" :text="text" />
    <template v-else>{{ text }}</template>
  </component>
</template>
