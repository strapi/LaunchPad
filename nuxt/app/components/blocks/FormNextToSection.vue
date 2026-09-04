<script setup lang="ts">
import type { StrapiMedia as Media } from '#shared/types/strapi';

/*
 * `type` is authored in Strapi as free text, so it is narrowed to the input
 * types this form actually supports rather than trusted straight into the DOM.
 */
type FieldType = 'text' | 'email' | 'tel' | 'url' | 'number';
const FIELD_TYPES: FieldType[] = ['text', 'email', 'tel', 'url', 'number'];

/** `textarea` selects a different element, so it is not an <input> type. */
const isTextarea = (value?: string) => value === 'textarea';
const asFieldType = (value?: string): FieldType =>
  FIELD_TYPES.includes(value as FieldType) ? (value as FieldType) : 'text';

interface Input {
  type?: string;
  name?: string;
  placeholder?: string;
}

const props = defineProps<{
  heading?: string;
  sub_heading?: string;
  form?: { inputs?: Input[] } | null;
  section?: {
    heading?: string;
    sub_heading?: string;
    users?: Array<{
      firstname?: string;
      lastname?: string;
      image?: Media | null;
    }>;
  } | null;
}>();

const inputs = computed(() => props.form?.inputs ?? []);

// The demo backend has no submission endpoint, so the form reports rather than
// pretending to send. Better an honest message than a silent no-op.
const status = ref('');
const onSubmit = () => {
  status.value =
    'This demo does not submit the form — wire it to your own endpoint.';
};

const fullName = (user: { firstname?: string; lastname?: string }) =>
  `${user.firstname ?? ''} ${user.lastname ?? ''}`.trim();
</script>

<template>
  <div class="relative py-20">
    <Container class="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
      <div data-reveal>
        <Heading class="text-left md:text-left">{{ heading }}</Heading>
        <Subheading v-if="sub_heading" class="mx-0 mt-4 text-left md:text-left">
          {{ sub_heading }}
        </Subheading>

        <form
          v-if="inputs.length"
          class="mt-8 space-y-4"
          @submit.prevent="onSubmit"
        >
          <div v-for="(input, index) in inputs" :key="index">
            <label class="sr-only" :for="`field-${input.name}`">
              {{ input.placeholder ?? input.name }}
            </label>
            <textarea
              v-if="isTextarea(input.type)"
              :id="`field-${input.name}`"
              :name="input.name"
              :placeholder="input.placeholder"
              rows="4"
              class="h-auto w-full rounded-md border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:ring-2 focus:ring-neutral-700 focus:outline-none"
            />
            <input
              v-else
              :id="`field-${input.name}`"
              :name="input.name"
              :type="asFieldType(input.type)"
              :placeholder="input.placeholder"
              class="h-11 w-full rounded-md border border-neutral-800 bg-neutral-900 px-4 text-sm text-white placeholder-neutral-500 focus:ring-2 focus:ring-neutral-700 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            class="bg-secondary w-full rounded-md px-4 py-3 text-sm font-medium text-black transition hover:bg-white"
          >
            Submit
          </button>
          <p class="text-xs text-neutral-500" role="status">{{ status }}</p>
        </form>
      </div>

      <div
        v-if="section"
        data-reveal
        style="--reveal-delay: 120ms"
        class="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-8"
      >
        <h3 class="text-xl font-semibold text-neutral-100">
          {{ section.heading }}
        </h3>
        <p class="text-muted mt-2 text-sm">{{ section.sub_heading }}</p>
        <div v-if="section.users?.length" class="mt-6 flex -space-x-3">
          <StrapiMedia
            v-for="(user, index) in section.users"
            :key="index"
            :media="user.image"
            :alt="fullName(user)"
            :width="56"
            :height="56"
            class="h-14 w-14 rounded-full border-2 border-neutral-900 object-cover"
          />
        </div>
      </div>
    </Container>
  </div>
</template>
