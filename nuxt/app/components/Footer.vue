<script setup lang="ts">
import type { Global, NavbarLink } from '#shared/types/strapi';

const props = defineProps<{
  data: Global['footer'];
  locale: string;
}>();

const columns = computed<Array<NavbarLink[] | undefined>>(() => [
  props.data?.internal_links,
  props.data?.policy_links,
  props.data?.social_media_links,
]);

const isExternal = (url: string) => url.startsWith('http');

/** External links keep their URL; internal ones get the locale prefix. */
const hrefFor = (url: string) =>
  isExternal(url) ? url : `/${props.locale}${url}`;
</script>

<template>
  <footer class="relative">
    <div
      class="bg-primary relative border-t border-neutral-900 px-8 pt-20 pb-32"
    >
      <div
        class="mx-auto flex max-w-7xl flex-col items-start justify-between text-sm text-neutral-500 sm:flex-row"
      >
        <div>
          <div class="mr-4 mb-4 md:flex">
            <Logo
              v-if="data?.logo?.image"
              :image="data.logo.image"
              :locale="locale"
            />
          </div>
          <div class="max-w-xs">{{ data?.description }}</div>
          <div class="mt-4">{{ data?.copyright }}</div>
          <div class="mt-10">
            Designed and Developed by
            <a class="text-white underline" href="https://aceternity.com">
              Aceternity
            </a>
            &amp;
            <a class="text-white underline" href="https://strapi.io">Strapi</a>
          </div>
          <div class="mt-2">
            built with
            <a class="text-white underline" href="https://strapi.io">Strapi</a>,
            <a class="text-white underline" href="https://nuxt.com">Nuxt</a>,
            and
            <a class="text-white underline" href="https://tailwindcss.com">
              Tailwind CSS
            </a>
          </div>
        </div>

        <div class="mt-10 grid grid-cols-3 items-start gap-10 md:mt-0">
          <template v-for="(links, index) in columns" :key="index">
            <div
              v-if="links?.length"
              class="mt-4 flex flex-col justify-center space-y-4"
            >
              <a
                v-for="link in links"
                :key="link.URL"
                class="text-muted text-xs transition-colors hover:text-neutral-400 sm:text-sm"
                :href="hrefFor(link.URL)"
                :target="isExternal(link.URL) ? '_blank' : undefined"
                :rel="isExternal(link.URL) ? 'noopener noreferrer' : undefined"
              >
                {{ link.text }}
              </a>
            </div>
          </template>
        </div>
      </div>
    </div>
  </footer>
</template>
