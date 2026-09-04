<script setup lang="ts">
import type { Article } from '#shared/types/strapi';

const route = useRoute();
assertLocale(String(route.params.locale));

const locale = useLocale();
const strapi = useStrapiClient();

const { data: articles } = await useAsyncData(
  computed(() => `articles-${locale.value}`),
  () =>
    strapi.collection<Article>('articles', {
      locale: locale.value,
      sort: 'publishedAt:desc',
    }),
  { watch: [locale], default: () => [] }
);

const { data: blogPage } = await useIndexPage('blog-page', locale);
const { data: global } = await useGlobal(locale);

useLaunchpadSeo({
  seo: computed(() => blogPage.value?.seo),
  global,
  locale,
});
</script>

<template>
  <div class="relative overflow-hidden pt-40 pb-20">
    <AmbientColor />
    <Container class="relative z-10">
      <Heading data-reveal>{{ blogPage?.heading ?? 'Blog' }}</Heading>
      <Subheading v-if="blogPage?.sub_heading" class="mt-4" data-reveal>
        {{ blogPage.sub_heading }}
      </Subheading>

      <div
        v-if="articles?.length"
        class="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        <ArticleCard
          v-for="(article, index) in articles"
          :key="article.documentId"
          :article="article"
          :locale="locale"
          :delay="index * 80"
        />
      </div>
      <p v-else class="text-muted mt-16 text-center">No articles yet.</p>
    </Container>
  </div>
</template>
