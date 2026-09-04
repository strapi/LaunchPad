<script setup lang="ts">
import type { Global } from '#shared/types/strapi';

/**
 * Fixed navbar with a mobile drawer.
 *
 * The React original used framer-motion to shrink the bar on scroll and
 * Headless UI for the drawer. Here the scroll effect is one passive listener
 * driving a boolean, and the drawer is a `v-if` — Vue's reactivity replaces
 * both libraries outright.
 */
const props = defineProps<{
  data: Global['navbar'];
  locale: string;
  /** Passed straight to the locale switcher; resolved by the layout. */
  localizedPaths?: Record<string, string>;
}>();

const left = computed(() => props.data?.left_navbar_items ?? []);
const right = computed(() => props.data?.right_navbar_items ?? []);
const localePath = (url: string) => `/${props.locale}${url}`;

const scrolled = ref(false);
const menuOpen = ref(false);

const onScroll = () => {
  scrolled.value = window.scrollY > 100;
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') menuOpen.value = false;
};

onMounted(() => {
  onScroll();
  // Passive: this only reads scrollY, it never calls preventDefault.
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  document.removeEventListener('keydown', onKeydown);
  document.body.style.overflow = '';
});

// Stop the page scrolling behind the drawer.
watch(menuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : '';
});

// A link inside the drawer navigates; the drawer should not stay open over it.
const route = useRoute();
watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false;
  }
);
</script>

<template>
  <nav
    class="fixed inset-x-0 top-4 z-50 mx-auto w-[95%] max-w-7xl lg:w-full"
    :data-scrolled="String(scrolled)"
  >
    <!-- Desktop -->
    <div
      class="navbar-shell mx-auto hidden w-full items-center justify-between rounded-md px-4 py-3 transition-[background-color,width] duration-300 lg:flex"
    >
      <div class="flex flex-row items-center gap-2">
        <Logo :image="data?.logo?.image" :locale="locale" />
        <div class="flex items-center gap-1.5">
          <NuxtLink
            v-for="item in left"
            :key="item.URL"
            :to="localePath(item.URL)"
            :target="item.target ?? undefined"
            class="flex items-center justify-center rounded-md px-4 py-2 text-sm leading-[110%] text-white transition duration-200 hover:bg-neutral-800 hover:text-white/80 hover:shadow-[0px_1px_0px_0px_var(--color-neutral-600)_inset]"
          >
            {{ item.text }}
          </NuxtLink>
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <LocaleSwitcher
          :current-locale="locale"
          :localized-paths="localizedPaths"
        />
        <AuthMenu :locale="locale" :links="right" />
      </div>
    </div>

    <!-- Mobile -->
    <div class="flex h-full w-full items-center lg:hidden">
      <div
        class="navbar-shell flex w-full items-center justify-between rounded-md px-2.5 py-1.5 transition duration-200"
      >
        <Logo :image="data?.logo?.image" :locale="locale" />
        <button
          type="button"
          aria-label="Open menu"
          :aria-expanded="menuOpen"
          class="p-1 text-white"
          @click="menuOpen = true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="h-6 w-6"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M432 176H80c-8.8 0-16-7.2-16-16s7.2-16 16-16h352c8.8 0 16 7.2 16 16s-7.2 16-16 16zM432 272H80c-8.8 0-16-7.2-16-16s7.2-16 16-16h352c8.8 0 16 7.2 16 16s-7.2 16-16 16zM432 368H80c-8.8 0-16-7.2-16-16s7.2-16 16-16h352c8.8 0 16 7.2 16 16s-7.2 16-16 16z"
            />
          </svg>
        </button>
      </div>
    </div>

    <div
      v-if="menuOpen"
      class="fixed inset-0 z-50 flex flex-col items-start justify-start space-y-10 bg-black pt-5 text-xl"
    >
      <div class="flex w-full items-center justify-between px-5">
        <Logo :image="data?.logo?.image" :locale="locale" />
        <div class="flex items-center space-x-2">
          <LocaleSwitcher
            :current-locale="locale"
            :localized-paths="localizedPaths"
          />
          <button
            type="button"
            aria-label="Close menu"
            class="p-1 text-white"
            @click="menuOpen = false"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="h-8 w-8"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M278.6 256l68.2-68.2c6.2-6.2 6.2-16.4 0-22.6-6.2-6.2-16.4-6.2-22.6 0L256 233.4l-68.2-68.2c-6.2-6.2-16.4-6.2-22.6 0-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3l68.2 68.2-68.2 68.2c-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3 6.2 6.2 16.4 6.2 22.6 0l68.2-68.2 68.2 68.2c6.2 6.2 16.4 6.2 22.6 0 6.2-6.2 6.2-16.4 0-22.6L278.6 256z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div class="flex flex-col items-start justify-start gap-[14px] px-8">
        <template v-for="item in left" :key="item.URL">
          <template v-if="item.children?.length">
            <NuxtLink
              v-for="child in item.children"
              :key="child.URL"
              :to="localePath(child.URL)"
              class="max-w-[15rem] text-left text-2xl"
            >
              <span class="block text-white">{{ child.text }}</span>
            </NuxtLink>
          </template>
          <NuxtLink v-else :to="localePath(item.URL)">
            <span class="block text-[26px] text-white">{{ item.text }}</span>
          </NuxtLink>
        </template>
      </div>

      <div class="flex w-full flex-row items-start gap-2.5 px-8 py-4">
        <AuthMenu :locale="locale" :links="right" />
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Replaces framer-motion's animated width/background on scroll. */
.navbar-shell {
  background-color: transparent;
  width: 100%;
}
nav[data-scrolled='true'] .navbar-shell {
  background-color: rgb(23 23 23);
  box-shadow:
    0px -2px 0px 0px var(--color-neutral-800),
    0px 2px 0px 0px var(--color-neutral-800);
}
@media (min-width: 1024px) {
  nav[data-scrolled='true'] .navbar-shell {
    width: 80%;
    border-radius: 0.375rem;
  }
}
</style>
