<script setup lang="ts">
import type { PreviewPayload } from '#shared/types/preview';

/**
 * Draft-mode renderer.
 *
 * The public site is prerendered from published content, so a draft-only entry
 * has no page to visit — which is exactly what an editor previewing an unsaved
 * article needs. This route renders the same views against `status=draft`, per
 * request.
 *
 * It lives under `/preview/...` rather than rewriting the public URLs because
 * the prerendered pages are served straight off disk; there is no render to
 * intercept. `/api/preview` redirects here after validating the secret.
 *
 * The draft cookie is HttpOnly and the draft fetches must not be reachable
 * from the browser, so all of that lives in `/api/preview-content` and this
 * page only renders what comes back. Landing here without going through
 * `/api/preview` gets a 404 rather than a way to read unpublished content.
 */
definePageMeta({ layout: 'default' });

const route = useRoute();

const path = computed(() => {
  const value = route.params.path;
  return Array.isArray(value) ? value.join('/') : String(value ?? '');
});

const { data } = await useAsyncData(
  computed(() => `preview-${path.value}`),
  () =>
    $fetch<PreviewPayload>('/api/preview-content', {
      query: { path: path.value },
      headers: useRequestHeaders(['cookie']),
    }),
  { watch: [path] }
);

const resolved = computed(() => data.value?.resolved ?? null);
const locale = computed(() => data.value?.locale ?? 'en');

/*
 * Both "you are not in draft mode" and "no such entry" are a 404. Throwing
 * rather than rendering a body means Nuxt sets the status too, so the admin's
 * preview pane and a stray visitor get the same honest answer.
 */
if (!data.value?.allowed || !resolved.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true,
  });
}

const seo = computed(() => {
  const value = resolved.value;
  if (value?.kind === 'page') return value.page.seo;
  if (value?.kind === 'article') return value.article.seo;
  if (value?.kind === 'product') return value.product.seo;
  return null;
});

useLaunchpadSeo({
  seo,
  global: computed(() => data.value?.global ?? null),
  locale,
});

// Drafts are never indexable — the preview pane is not a public page.
useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] });
</script>

<template>
  <div v-if="resolved">
    <DynamicZone
      v-if="resolved.kind === 'page'"
      :zone="resolved.page.dynamic_zone"
      :locale="locale"
    />

    <ArticleView
      v-else-if="resolved.kind === 'article'"
      :article="resolved.article"
      :locale="locale"
    />

    <ProductView
      v-else-if="resolved.kind === 'product'"
      :product="resolved.product"
      :locale="locale"
    />

    <div
      v-else-if="resolved.kind === 'blog-index'"
      class="relative overflow-hidden pt-40 pb-20"
    >
      <AmbientColor />
      <Container class="relative z-10">
        <Heading>{{ resolved.heading ?? 'Blog' }}</Heading>
        <div class="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <ArticleCard
            v-for="article in resolved.articles"
            :key="article.documentId"
            :article="article"
            :locale="locale"
          />
        </div>
      </Container>
    </div>

    <div
      v-else-if="resolved.kind === 'product-index'"
      class="relative overflow-hidden pt-40 pb-20"
    >
      <AmbientColor />
      <Container class="relative z-10">
        <Heading>{{ resolved.heading ?? 'Products' }}</Heading>
        <div class="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
          <ProductCard
            v-for="product in resolved.products"
            :key="product.documentId"
            :product="product"
            :locale="locale"
          />
        </div>
      </Container>
    </div>
  </div>
</template>
