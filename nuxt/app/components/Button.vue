<script setup lang="ts">
/**
 * Renders an `<a>` when given an href and a `<button>` otherwise.
 *
 * Internal links go through `<NuxtLink>` so navigation stays client-side;
 * external ones fall back to a plain anchor, since there is nothing for the
 * router to do with them.
 */
type Variant = 'primary' | 'secondary' | 'simple' | 'muted';

const props = withDefaults(
  defineProps<{
    href?: string;
    variant?: Variant | string;
    target?: string | null;
  }>(),
  { variant: 'primary' }
);

const base =
  'relative z-10 inline-flex cursor-pointer items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition duration-200 hover:-translate-y-0.5';

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-secondary text-black shadow-[0px_-1px_0px_0px_#FFFFFF40_inset,0px_1px_0px_0px_#FFFFFF40_inset] hover:bg-white',
  secondary: 'bg-transparent text-white shadow-none',
  simple:
    'bg-transparent text-white shadow-none hover:bg-neutral-800 hover:shadow-[0px_1px_0px_0px_var(--color-neutral-600)_inset]',
  muted:
    'bg-neutral-800 text-white shadow-[0px_1px_0px_0px_var(--color-neutral-600)_inset] hover:bg-neutral-700',
};

const classes = computed(() => [
  base,
  VARIANTS[props.variant as Variant] ?? VARIANTS.primary,
]);

const isExternal = computed(() => !!props.href?.startsWith('http'));
const rel = computed(() =>
  props.target === '_blank' ? 'noopener noreferrer' : undefined
);
</script>

<template>
  <NuxtLink
    v-if="href && !isExternal"
    :to="href"
    :target="target ?? undefined"
    :rel="rel"
    :class="classes"
  >
    <slot />
  </NuxtLink>

  <a
    v-else-if="href"
    :href="href"
    :target="target ?? undefined"
    :rel="rel ?? 'noopener noreferrer'"
    :class="classes"
  >
    <slot />
  </a>

  <button v-else type="button" :class="classes">
    <slot />
  </button>
</template>
