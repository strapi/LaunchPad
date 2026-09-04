<script setup lang="ts">
import type { Article } from '#shared/types/strapi';

withDefaults(
  defineProps<{
    heading?: string;
    sub_heading?: string;
    articles?: Article[];
    locale: string;
  }>(),
  { articles: () => [] }
);
</script>

<template>
  <div class="relative py-20">
    <Container>
      <Heading data-reveal>{{ heading }}</Heading>
      <Subheading v-if="sub_heading" class="mt-4" data-reveal>
        {{ sub_heading }}
      </Subheading>
      <div
        v-if="articles.length"
        class="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        <ArticleCard
          v-for="(article, index) in articles"
          :key="article.documentId ?? index"
          :article="article"
          :locale="locale"
          :delay="index * 80"
        />
      </div>
    </Container>
  </div>
</template>
