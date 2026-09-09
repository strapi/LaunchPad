<script setup lang="ts">
/*
 * Shown only when draft mode is on, and hidden inside the Strapi preview
 * iframe — the admin already provides its own controls there and a second
 * banner would just cover content.
 *
 * The iframe test has to wait for mount: `window.top` does not exist while the
 * page is being rendered on the server.
 */
const isTopLevel = ref(false);

onMounted(() => {
  isTopLevel.value = window.top === window.self;
});
</script>

<template>
  <div
    v-if="isTopLevel"
    class="bg-secondary fixed right-4 bottom-4 z-50 flex items-center gap-4 rounded-lg px-6 py-3 text-black shadow-lg"
  >
    <span class="flex items-center gap-2 font-semibold">
      <span class="inline-block h-4 w-4 animate-pulse rounded-full bg-black" />
      Draft Mode
    </span>
    <a
      href="/api/exit-preview"
      class="rounded bg-black px-4 py-1 text-sm font-medium text-white transition-colors hover:bg-gray-800"
    >
      Exit Draft
    </a>
  </div>
</template>
