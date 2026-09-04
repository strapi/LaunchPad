<script setup lang="ts">
import type { BlockNode } from '#shared/types/strapi';

/**
 * Renders a Strapi `blocks` (rich text) field.
 *
 * Replaces `@strapi/blocks-react-renderer`, which is React-only. The node
 * types are a small closed set, so a recursive component covers them.
 */
defineProps<{ content?: BlockNode[] | null }>();
</script>

<template>
  <div v-if="content?.length">
    <BlocksNode v-for="(node, i) in content" :key="i" :node="node" />
  </div>
</template>
