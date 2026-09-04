<script setup lang="ts">
import { formatDate } from '#shared/lib/i18n';
import type { Article } from '#shared/types/strapi';

const props = withDefaults(
  defineProps<{
    article: Article;
    locale: string;
    delay?: number;
  }>(),
  { delay: 0 }
);

const published = computed(() =>
  formatDate(props.article.publishedAt, props.locale)
);
</script>

<template>
  <NuxtLink
    :to="`/${locale}/blog/${article.slug}`"
    data-reveal
    :style="`--reveal-delay: ${delay}ms`"
    class="group flex flex-col overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/50 transition duration-200 hover:border-neutral-700"
  >
    <div class="aspect-[16/10] w-full overflow-hidden bg-neutral-900">
      <StrapiMedia
        v-if="article.image"
        :media="article.image"
        :alt="article.title"
        :width="800"
        :height="500"
        class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
      />
    </div>
    <div class="flex flex-1 flex-col p-5">
      <div v-if="article.categories?.length" class="mb-3 flex flex-wrap gap-2">
        <span
          v-for="category in article.categories"
          :key="category.name"
          class="text-muted rounded-full bg-neutral-800 px-2 py-1 text-xs font-bold capitalize"
        >
          {{ category.name }}
        </span>
      </div>
      <h3
        class="text-base font-semibold text-neutral-100 transition group-hover:text-white md:text-lg"
      >
        {{ article.title }}
      </h3>
      <p
        v-if="article.description"
        class="text-muted mt-2 line-clamp-3 text-sm"
      >
        {{ article.description }}
      </p>
      <time v-if="published" class="mt-4 text-xs text-neutral-500">
        {{ published }}
      </time>
    </div>
  </NuxtLink>
</template>
