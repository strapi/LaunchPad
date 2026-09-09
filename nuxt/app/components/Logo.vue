<script setup lang="ts">
import type { StrapiMedia as StrapiMediaType } from '#shared/types/strapi';

defineProps<{
  image?: StrapiMediaType | null;
  locale: string;
}>();
</script>

<template>
  <NuxtLink
    :to="`/${locale}`"
    class="relative z-20 mr-4 flex items-center space-x-2 text-sm font-normal"
  >
    <StrapiMedia
      v-if="image"
      :media="image"
      :alt="image.alternativeText ?? 'LaunchPad'"
      :width="200"
      :height="200"
      loading="eager"
      class="mr-2 h-10 w-10 rounded-xl object-cover"
    />
    <span class="font-bold text-white">LaunchPad</span>
  </NuxtLink>
</template>
