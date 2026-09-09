<script setup lang="ts">
import { formatDate } from '#shared/lib/i18n';
import type { Article } from '#shared/types/strapi';

/**
 * The article detail body, shared by the prerendered route and the on-demand
 * preview route so draft and published render identically.
 */
const props = defineProps<{
  article: Article;
  locale: string;
}>();

const published = computed(() =>
  formatDate(props.article.publishedAt, props.locale)
);
</script>

<template>
  <div class="relative overflow-hidden">
    <AmbientColor />
    <Container class="relative z-10 mt-16 lg:mt-32">
      <div class="flex items-center justify-between px-2 py-8">
        <NuxtLink :to="`/${locale}/blog`" class="flex items-center space-x-2">
          <svg
            class="text-muted h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span class="text-muted text-sm">Back</span>
        </NuxtLink>
      </div>

      <div class="mx-auto w-full">
        <StrapiMedia
          v-if="article.image"
          :media="article.image"
          :alt="article.title"
          :width="800"
          :height="800"
          loading="eager"
          class="aspect-square h-40 w-full rounded-3xl object-cover [mask-image:radial-gradient(circle,white,transparent)] md:h-96"
        />
        <div
          v-else
          class="shadow-derek aspect-square h-40 w-full rounded-3xl bg-neutral-900 md:h-96"
        />
      </div>

      <div class="xl:relative">
        <div class="mx-auto max-w-2xl">
          <article class="pt-8 pb-8">
            <div v-if="article.categories?.length" class="flex flex-wrap gap-4">
              <p
                v-for="category in article.categories"
                :key="category.name"
                class="text-muted rounded-full bg-neutral-800 px-2 py-1 text-xs font-bold capitalize"
              >
                {{ category.name }}
              </p>
            </div>

            <h1
              class="mt-8 text-4xl font-bold tracking-tight text-neutral-200 sm:text-5xl"
            >
              {{ article.title }}
            </h1>

            <BlocksRenderer
              :content="article.content"
              class="prose prose-sm prose-invert mt-8 max-w-none"
            />

            <div
              v-if="published"
              class="mt-12 flex items-center space-x-2 border-t border-neutral-800 pt-12"
            >
              <div class="h-5 w-0.5 rounded-lg bg-neutral-700" />
              <time :datetime="article.publishedAt" class="text-muted text-sm">
                {{ published }}
              </time>
            </div>
          </article>
        </div>
      </div>

      <DynamicZone
        v-if="article.dynamic_zone?.length"
        :zone="article.dynamic_zone"
        :locale="locale"
      />
    </Container>
  </div>
</template>
