<script setup lang="ts">
import { isAudio, isVideo, strapiMedia } from '#shared/lib/media';
import { getStrapiSource } from '#shared/lib/source-map';
import type { StrapiMedia as StrapiMediaType } from '#shared/types/strapi';

/**
 * Renders a Strapi media field.
 *
 * Branches on `mime` because LaunchPad's media fields accept videos and audio,
 * not just images — `product.images` and `article.image` both do. Feeding a
 * video to an `<img>` renders a broken icon, so the type has to be respected.
 *
 * Deliberately a plain `<img>` rather than `<NuxtImg>`: these are remote CMS
 * URLs whose dimensions vary per entry, and optimising them would mean either
 * proxying every asset at build time or configuring a remote image service.
 * Neither is worth it for a demo, and both would break draft mode, where the
 * URL is only known per request.
 */
const props = withDefaults(
  defineProps<{
    media?: StrapiMediaType | null;
    /** Overrides `media.alternativeText`; required when the media has none. */
    alt?: string | null;
    width?: number | string;
    height?: number | string;
    loading?: 'lazy' | 'eager';
    /**
     * Visual-editing mapping. Decoded from the media URL automatically — only
     * pass this to override it.
     */
    dataStrapiSource?: string;
  }>(),
  { loading: 'lazy' }
);

const strapiUrl = useStrapiUrl();

const src = computed(() => strapiMedia(props.media?.url, strapiUrl));
const label = computed(() => props.alt ?? props.media?.alternativeText ?? '');

/*
 * Decode from the RAW url, before strapiMedia() strips the markers out of it.
 * Undefined outside draft mode, so the attribute is simply absent in
 * production rather than empty.
 */
const strapiSource = computed(
  () => props.dataStrapiSource ?? getStrapiSource(props.media?.url)
);
</script>

<template>
  <video
    v-if="src && isVideo(media?.mime)"
    :src="src"
    controls
    preload="metadata"
    :data-strapi-source="strapiSource"
  />

  <audio
    v-else-if="src && isAudio(media?.mime)"
    :src="src"
    controls
    :data-strapi-source="strapiSource"
  />

  <img
    v-else-if="src"
    :src="src"
    :alt="label"
    :width="width"
    :height="height"
    :loading="loading"
    decoding="async"
    :data-strapi-source="strapiSource"
  />
</template>
