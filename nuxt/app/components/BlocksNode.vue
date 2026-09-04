<script setup lang="ts">
import { normalizeStrapiMediaUrl, stripStegaMarkers } from '#shared/lib/media';
import { getStrapiSource } from '#shared/lib/source-map';
import type { BlockNode } from '#shared/types/strapi';

/**
 * One node of a Strapi blocks tree. Recurses into `children`.
 *
 * The `image` case matters: blocks content stores the media URL captured in
 * the authoring environment, which for local uploads is a relative
 * `/uploads/...` path. Rendered as-is it resolves against the Nuxt origin and
 * 404s, so it is rebuilt against the current Strapi host.
 */
const props = defineProps<{ node: BlockNode }>();

const strapiUrl = useStrapiUrl();

const children = computed(() => props.node.children ?? []);

/** Headings are one component with a computed tag rather than four branches. */
const headingTag = computed(() => {
  const level = props.node.level ?? 1;
  return `h${Math.min(Math.max(level, 1), 4)}`;
});

const HEADING_CLASSES: Record<string, string> = {
  h1: 'mt-10 mb-4 text-3xl font-bold text-neutral-100 md:text-4xl',
  h2: 'mt-10 mb-4 text-2xl font-bold text-neutral-100 md:text-3xl',
  h3: 'mt-8 mb-3 text-xl font-bold text-neutral-100 md:text-2xl',
  h4: 'mt-6 mb-2 text-lg font-bold text-neutral-100',
};

const isExternalLink = computed(() => !!props.node.url?.startsWith('http'));

const codeText = computed(() =>
  children.value.map((child) => child.text ?? '').join('')
);

const imageSrc = computed(() =>
  props.node.image?.url
    ? normalizeStrapiMediaUrl(props.node.image.url, strapiUrl)
    : null
);

const imageAlt = computed(() =>
  stripStegaMarkers(
    props.node.image?.alternativeText || props.node.image?.name || ''
  )
);
</script>

<template>
  <p v-if="node.type === 'paragraph'" class="mb-4 leading-relaxed">
    <BlocksNode v-for="(child, i) in children" :key="i" :node="child" />
  </p>

  <component
    :is="headingTag"
    v-else-if="node.type === 'heading'"
    :class="HEADING_CLASSES[headingTag]"
  >
    <BlocksNode v-for="(child, i) in children" :key="i" :node="child" />
  </component>

  <ol
    v-else-if="node.type === 'list' && node.format === 'ordered'"
    class="mb-4 list-decimal space-y-2 pl-6"
  >
    <BlocksNode v-for="(child, i) in children" :key="i" :node="child" />
  </ol>

  <ul v-else-if="node.type === 'list'" class="mb-4 list-disc space-y-2 pl-6">
    <BlocksNode v-for="(child, i) in children" :key="i" :node="child" />
  </ul>

  <li v-else-if="node.type === 'list-item'">
    <BlocksNode v-for="(child, i) in children" :key="i" :node="child" />
  </li>

  <blockquote
    v-else-if="node.type === 'quote'"
    class="my-6 border-l-2 border-neutral-700 pl-4 text-neutral-300 italic"
  >
    <BlocksNode v-for="(child, i) in children" :key="i" :node="child" />
  </blockquote>

  <pre
    v-else-if="node.type === 'code'"
    class="my-6 overflow-x-auto rounded-lg bg-neutral-900 p-4 text-sm"
  ><code>{{ codeText }}</code></pre>

  <NuxtLink
    v-else-if="node.type === 'link' && !isExternalLink"
    :to="node.url ?? '#'"
    class="text-cyan-400 underline underline-offset-4 hover:text-cyan-300"
  >
    <BlocksNode v-for="(child, i) in children" :key="i" :node="child" />
  </NuxtLink>

  <a
    v-else-if="node.type === 'link'"
    :href="node.url"
    class="text-cyan-400 underline underline-offset-4 hover:text-cyan-300"
    rel="noopener noreferrer"
    target="_blank"
  >
    <BlocksNode v-for="(child, i) in children" :key="i" :node="child" />
  </a>

  <img
    v-else-if="node.type === 'image' && imageSrc"
    :src="imageSrc"
    :alt="imageAlt"
    :width="node.image?.width"
    :height="node.image?.height"
    loading="lazy"
    decoding="async"
    class="my-6 rounded-lg"
    :data-strapi-source="getStrapiSource(node.image?.url)"
  />

  <BlocksText v-else-if="node.type === 'text'" :node="node" />
</template>
