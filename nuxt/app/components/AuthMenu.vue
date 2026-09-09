<script setup lang="ts">
import type { NavbarLink } from '#shared/types/strapi';

/**
 * The signed-in / signed-out part of the navbar.
 *
 * Where the Astro port had to hand-write DOM updates for this, here it is just
 * reactive state: `useAuth()` holds one answer, both navbars render from it,
 * and the logout button mutates it directly.
 *
 * While `pending` holds, neither state renders — see the note in `useAuth`.
 */
defineProps<{
  locale: string;
  links: NavbarLink[];
}>();

const { user, pending, refresh, logout } = useAuth();
const loggingOut = ref(false);

// Client-only: the pages are prerendered, so there is no server render in
// which to have known who this is.
onMounted(() => {
  void refresh();
});

async function onLogout() {
  loggingOut.value = true;
  try {
    await logout();
  } finally {
    loggingOut.value = false;
  }
}
</script>

<template>
  <div class="flex items-center gap-2" :class="pending && 'invisible'">
    <!-- Signed out: whatever Strapi has configured, e.g. Book a demo / Sign up -->
    <div v-if="!user" class="flex items-center gap-2">
      <NuxtLink
        :to="`/${locale}/sign-in`"
        class="px-4 py-2 text-sm text-white transition-colors hover:text-neutral-300"
      >
        Sign in
      </NuxtLink>
      <Button
        v-for="(item, index) in links"
        :key="item.URL"
        :href="`/${locale}${item.URL}`"
        :variant="index === links.length - 1 ? 'primary' : 'simple'"
      >
        {{ item.text }}
      </Button>
    </div>

    <!-- Signed in -->
    <div v-else class="flex items-center gap-2">
      <span class="hidden px-3 py-2 text-sm text-white xl:inline">
        Hi, <span class="font-medium">{{ user.username }}</span>
      </span>
      <button
        type="button"
        :disabled="loggingOut"
        class="flex items-center gap-2 rounded-md border border-transparent px-4 py-2 text-sm text-white transition duration-200 hover:bg-neutral-800 disabled:opacity-50"
        @click="onLogout"
      >
        <svg
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path
            d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"
          />
          <path d="M9 12h12l-3 -3" />
          <path d="M18 15l3 -3" />
        </svg>
        <span class="hidden md:inline">Log out</span>
      </button>
    </div>
  </div>
</template>
