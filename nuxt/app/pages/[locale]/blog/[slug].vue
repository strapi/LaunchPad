<script setup lang="ts">
const route = useRoute();
assertLocale(String(route.params.locale));

const locale = useLocale();
const slug = computed(() => String(route.params.slug));

const { data: article } = await useArticle(locale, slug);

if (!article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Article not found',
    fatal: true,
  });
}

const { data: global } = await useGlobal(locale);
useLaunchpadSeo({
  seo: computed(() => article.value?.seo),
  global,
  locale,
});
</script>

<template>
  <ArticleView v-if="article" :article="article" :locale="locale" />
</template>
