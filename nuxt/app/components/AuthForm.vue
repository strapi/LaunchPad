<script setup lang="ts">
import type { StrapiMedia } from '#shared/types/strapi';

/**
 * Sign-in and sign-up share a layout and a submit path, so they share a
 * component. `mode` decides the endpoint, the copy, and whether a username
 * field appears — Strapi's `register` requires one, `login` does not.
 *
 * Submission goes through `$fetch` rather than a native form POST so the
 * response can be handled in place: a failed sign-in should say why without
 * losing what was typed, which a full page reload would discard.
 */
const props = defineProps<{
  mode: 'sign-in' | 'sign-up';
  locale: string;
  logo?: StrapiMedia | null;
}>();

const isSignUp = computed(() => props.mode === 'sign-up');
const heading = computed(() =>
  isSignUp.value ? 'Sign up for LaunchPad' : 'Sign in to LaunchPad'
);
const action = computed(() =>
  isSignUp.value ? '/api/auth/register' : '/api/auth/login'
);

const form = reactive({ username: '', email: '', password: '' });
const error = ref('');
const submitting = ref(false);

const inputClass =
  'h-10 w-full rounded-md border border-neutral-800 bg-charcoal pl-4 text-sm text-white placeholder-neutral-500 focus:ring-2 focus:ring-neutral-800 focus:outline-none mb-4';

async function onSubmit() {
  error.value = '';
  submitting.value = true;

  try {
    await $fetch(action.value, {
      method: 'POST',
      credentials: 'same-origin',
      body: isSignUp.value
        ? {
            username: form.username,
            email: form.email,
            password: form.password,
          }
        : { email: form.email, password: form.password },
    });

    // Full navigation rather than a router push: the session cookie is now set,
    // and a hard load is the simplest way to be sure every cached payload on
    // the page reflects it.
    window.location.href = `/${props.locale}`;
  } catch (err: unknown) {
    // The endpoints return `{ error }` with a 4xx, which $fetch puts on `data`.
    const data = (err as { data?: { error?: string } })?.data;
    error.value = data?.error ?? 'Something went wrong. Try again.';
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="relative overflow-hidden">
    <AmbientColor />
    <Container
      class="relative z-10 flex min-h-screen max-w-lg flex-col items-center justify-center py-24"
    >
      <Logo :image="logo" :locale="locale" />

      <h1 class="my-4 text-xl font-bold md:text-4xl">{{ heading }}</h1>

      <form class="my-4 w-full" novalidate @submit.prevent="onSubmit">
        <template v-if="isSignUp">
          <label class="sr-only" for="auth-username">Username</label>
          <input
            id="auth-username"
            v-model="form.username"
            type="text"
            name="username"
            autocomplete="username"
            placeholder="Username"
            required
            :class="inputClass"
          />
        </template>

        <label class="sr-only" for="auth-email">Email address</label>
        <input
          id="auth-email"
          v-model="form.email"
          type="email"
          name="email"
          autocomplete="email"
          placeholder="Email Address"
          required
          :class="inputClass"
        />

        <label class="sr-only" for="auth-password">Password</label>
        <input
          id="auth-password"
          v-model="form.password"
          type="password"
          name="password"
          :autocomplete="isSignUp ? 'new-password' : 'current-password'"
          placeholder="Password"
          required
          minlength="6"
          :class="inputClass"
        />

        <button
          type="submit"
          :disabled="submitting"
          class="w-full rounded-md bg-neutral-800 py-3 text-sm font-medium text-white shadow-[0px_1px_0px_0px_var(--color-neutral-600)_inset] transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ isSignUp ? 'Sign up' : 'Sign in' }}
        </button>

        <p
          class="mt-4 min-h-5 text-center text-sm text-red-400"
          role="alert"
          aria-live="polite"
        >
          {{ error }}
        </p>
      </form>

      <p class="text-muted text-sm">
        {{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
        <NuxtLink
          :to="`/${locale}/${isSignUp ? 'sign-in' : 'sign-up'}`"
          class="text-white underline underline-offset-4"
        >
          {{ isSignUp ? 'Sign in' : 'Sign up' }}
        </NuxtLink>
      </p>
    </Container>
  </div>
</template>
