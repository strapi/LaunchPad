<script setup lang="ts">
/**
 * Page shell: navbar, footer, and the preview plumbing.
 *
 * The layout fetches `global` itself rather than taking it as a prop. Nuxt
 * layouts sit above the page in the tree, so a prop would have to travel
 * upwards; instead both call the same `useContent` helper with the same key and
 * `useAsyncData` collapses them into a single request.
 *
 * Draft mode is read from the path. `/preview/...` is the only route that
 * renders drafts, and it is server-rendered per request, so the path is an
 * exact answer — no extra state to thread through.
 *
 * Which source `global` comes from follows from that, and it is the whole point
 * of the split below. `useGlobal()` reads *published* content: it runs in the
 * app, and the cookie authorising a draft read is HttpOnly. On a preview route
 * it would quietly hand the navbar and footer published strings with no source
 * map markers in them — the page would be click-to-edit and the chrome around
 * it would not, with nothing to say why. So on `/preview/**` the global comes
 * out of the draft payload the server assembled instead, and the published
 * fetch is switched off.
 */
const route = useRoute();
const locale = useLocale();

const isDraftMode = computed(() => route.path.startsWith('/preview'));

/** `<locale>/<...>` — the path the preview route was asked to render. */
const previewPath = computed(() => {
  const value = route.params.path;
  return Array.isArray(value) ? value.join('/') : String(value ?? '');
});

const { data: preview } = await usePreviewPayload(previewPath, isDraftMode);
const { data: publishedGlobal } = await useGlobal(
  locale,
  computed(() => !isDraftMode.value)
);

const global = computed(() =>
  isDraftMode.value ? (preview.value?.global ?? null) : publishedGlobal.value
);

/*
 * `/preview/fr/...` has no `[locale]` route param for `useLocale()` to read, so
 * outside the public routes the locale comes from the payload the server
 * resolved. Without this the French preview renders an English navbar.
 */
const activeLocale = computed(() =>
  isDraftMode.value ? (preview.value?.locale ?? locale.value) : locale.value
);

/*
 * Resolved here, not in the page: the navbar renders before the page's `<slot>`
 * during SSR, so anything the page published would arrive too late. See the
 * note in `useLocalizedPaths`.
 */
const localizedPaths = useRouteLocalizedPaths();
</script>

<template>
  <div class="bg-charcoal h-full w-full antialiased">
    <PreviewBridge />
    <Navbar
      :data="global?.navbar"
      :locale="activeLocale"
      :localized-paths="localizedPaths"
    />
    <main id="main-content">
      <slot />
    </main>
    <Footer :data="global?.footer" :locale="activeLocale" />
    <DraftModeBanner v-if="isDraftMode" />
  </div>
</template>
