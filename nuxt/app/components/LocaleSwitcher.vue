<script setup lang="ts">
import { LOCALES } from '#shared/lib/i18n';

/**
 * Locale toggle.
 *
 * Rendered as real links so it works without JavaScript and search engines can
 * follow it — the React version used a click handler and a router call.
 *
 * Three cases, and the third is the one that is easy to get wrong:
 *
 *  - No `localizedPaths` (a static route like `/en/blog`): swap the locale
 *    segment. The path is the same in every locale.
 *  - A translation exists: link to its slug, which differs — `/en/blog/foo`
 *    is `/fr/blog/quelque-chose`.
 *  - `localizedPaths` is present but has no entry for that locale: the entry is
 *    genuinely untranslated. LaunchPad's demo data has exactly one of these, a
 *    French-only article. Swapping the segment there produces a URL that does
 *    not exist, so the locale is rendered disabled instead of as a dead link.
 */
const props = defineProps<{
  currentLocale: string;
  /**
   * Map of locale -> path *after* the locale prefix, e.g. `blog/bonjour`.
   * Resolved by the layout — see `useLocalizedPaths`.
   */
  localizedPaths?: Record<string, string>;
}>();

const route = useRoute();

/** True when this page is a localised entry that has no such translation. */
function isMissing(locale: string): boolean {
  return !!props.localizedPaths && props.localizedPaths[locale] === undefined;
}

function hrefFor(locale: string): string {
  const localized = props.localizedPaths?.[locale];
  if (localized !== undefined) {
    return localized === '' ? `/${locale}` : `/${locale}/${localized}`;
  }
  const rest = route.path.split('/').filter(Boolean).slice(1);
  return rest.length ? `/${locale}/${rest.join('/')}` : `/${locale}`;
}

const baseClass =
  'flex w-8 items-center justify-center rounded-md py-1 text-sm leading-[110%] transition duration-200';
const activeClass =
  'bg-neutral-800 text-white shadow-[0px_1px_0px_0px_var(--color-neutral-600)_inset]';
const linkClass =
  'cursor-pointer text-white hover:bg-neutral-800 hover:text-white/80 hover:shadow-[0px_1px_0px_0px_var(--color-neutral-600)_inset]';
</script>

<template>
  <div class="flex gap-2 rounded-md p-1">
    <template v-for="locale in LOCALES" :key="locale">
      <span
        v-if="isMissing(locale)"
        :class="[baseClass, 'cursor-not-allowed text-neutral-600']"
        aria-disabled="true"
        title="Not available in this language"
      >
        {{ locale }}
      </span>
      <NuxtLink
        v-else
        :to="hrefFor(locale)"
        :hreflang="locale"
        :aria-current="locale === currentLocale ? 'true' : undefined"
        :class="[baseClass, linkClass, locale === currentLocale && activeClass]"
      >
        {{ locale }}
      </NuxtLink>
    </template>
  </div>
</template>
