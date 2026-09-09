<script setup lang="ts">
import { formatPrice } from '#shared/lib/i18n';
import type { NavbarLink, Perk } from '#shared/types/strapi';

interface Plan {
  name: string;
  price?: number | null;
  sub_text?: string | null;
  featured?: boolean;
  CTA?: (NavbarLink & { variant?: string }) | null;
  perks?: Perk[];
  additional_perks?: Perk[];
}

const props = withDefaults(
  defineProps<{
    heading?: string;
    sub_heading?: string;
    plans?: Plan[];
    locale: string;
  }>(),
  { plans: () => [] }
);

const price = (value?: number | null) => formatPrice(value, props.locale);

const ctaHref = (cta: Plan['CTA']) =>
  cta?.URL?.startsWith('http') ? cta.URL : `/${props.locale}${cta?.URL ?? ''}`;
</script>

<template>
  <div class="relative py-20">
    <Container>
      <Heading data-reveal>{{ heading }}</Heading>
      <Subheading v-if="sub_heading" class="mt-4" data-reveal>
        {{ sub_heading }}
      </Subheading>

      <div
        v-if="plans.length"
        class="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:items-start"
      >
        <div
          v-for="(plan, index) in plans"
          :key="plan.name"
          data-reveal
          :style="`--reveal-delay: ${index * 80}ms`"
          class="rounded-3xl border-2 p-4"
          :class="
            plan.featured
              ? 'border-cyan-600 bg-neutral-900'
              : 'border-neutral-800 bg-neutral-900'
          "
        >
          <div class="rounded-2xl bg-neutral-800 p-4">
            <p class="text-sm font-medium text-neutral-200">{{ plan.name }}</p>
            <p
              v-if="price(plan.price)"
              class="mt-8 text-4xl font-bold text-white"
            >
              {{ price(plan.price) }}
            </p>
            <p v-if="plan.sub_text" class="text-muted mt-1 text-xs">
              {{ plan.sub_text }}
            </p>
            <Button
              v-if="plan.CTA"
              class="mt-8 mb-2 w-full"
              :variant="plan.featured ? 'primary' : 'muted'"
              :href="ctaHref(plan.CTA)"
            >
              {{ plan.CTA.text }}
            </Button>
          </div>

          <ul class="mt-1 space-y-4 p-4">
            <li
              v-for="(perk, i) in plan.perks ?? []"
              :key="`perk-${i}`"
              class="flex items-start gap-2"
            >
              <svg
                class="mt-0.5 h-4 w-4 shrink-0 text-cyan-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12l5 5L20 7" />
              </svg>
              <span class="text-muted text-sm">{{ perk.text }}</span>
            </li>
            <li
              v-for="(perk, i) in plan.additional_perks ?? []"
              :key="`extra-${i}`"
              class="flex items-start gap-2 opacity-70"
            >
              <svg
                class="mt-0.5 h-4 w-4 shrink-0 text-neutral-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12l5 5L20 7" />
              </svg>
              <span class="text-muted text-sm">{{ perk.text }}</span>
            </li>
          </ul>
        </div>
      </div>
    </Container>
  </div>
</template>
