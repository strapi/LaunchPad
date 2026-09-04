<script setup lang="ts">
import type { BlockNode } from '#shared/types/strapi';

/**
 * A leaf text node with its inline marks.
 *
 * Strapi applies marks as independent booleans on the same node, so they nest
 * rather than being mutually exclusive: bold + italic + code is one node with
 * three flags. Rather than enumerate the combinations, the marks are folded
 * into a list of wrapping elements and rendered as nested `<component :is>` —
 * something Vue can do at runtime and Astro cannot.
 */
const props = defineProps<{ node: BlockNode }>();

const text = computed(() => props.node.text ?? '');

/** Outermost first. `code` wins on its own, matching Strapi's own renderer. */
const wrappers = computed<string[]>(() => {
  if (props.node.code) return ['code'];
  const tags: string[] = [];
  if (props.node.bold) tags.push('strong');
  if (props.node.italic) tags.push('em');
  if (props.node.underline) tags.push('u');
  if (props.node.strikethrough) tags.push('s');
  return tags;
});
</script>

<template>
  <code
    v-if="node.code"
    class="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-[0.9em] text-neutral-200"
    >{{ text }}</code
  >
  <BlocksMarks v-else-if="wrappers.length" :tags="wrappers" :text="text" />
  <template v-else>{{ text }}</template>
</template>
