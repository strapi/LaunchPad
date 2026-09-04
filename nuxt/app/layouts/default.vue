<script setup lang="ts">
/**
 * Page shell: navbar, footer, and the preview plumbing.
 *
 * The layout fetches `global` itself rather than taking it as a prop. Nuxt
 * layouts sit above the page in the tree, so a prop would have to travel
 * upwards; instead both call `useGlobal()` with the same key and `useAsyncData`
 * collapses them into a single request.
 *
 * Draft mode is read from the path. `/preview/...` is the only route that
 * renders drafts, and it is server-rendered per request, so the path is an
 * exact answer — no extra state to thread through.
 */
const route = useRoute();
const locale = useLocale();
const { data: global } = await useGlobal(locale);

/*
 * Resolved here, not in the page: the navbar renders before the page's `<slot>`
 * during SSR, so anything the page published would arrive too late. See the
 * note in `useLocalizedPaths`.
 */
const localizedPaths = useRouteLocalizedPaths();

const isDraftMode = computed(() => route.path.startsWith('/preview'));
</script>

<template>
  <div class="bg-charcoal h-full w-full antialiased">
    <PreviewBridge />
    <Navbar
      :data="global?.navbar"
      :locale="locale"
      :localized-paths="localizedPaths"
    />
    <main id="main-content">
      <slot />
    </main>
    <Footer :data="global?.footer" :locale="locale" />
    <DraftModeBanner v-if="isDraftMode" />
  </div>
</template>
