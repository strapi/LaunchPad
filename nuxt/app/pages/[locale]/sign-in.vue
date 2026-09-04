<script setup lang="ts">
/*
 * Prerendered like every other page. The form posts to the on-demand auth
 * endpoints, so nothing here needs to be rendered per request.
 */
const route = useRoute();
assertLocale(String(route.params.locale));

const locale = useLocale();
const { data: global } = await useGlobal(locale);

useLaunchpadSeo({
  seo: computed(() => ({ metaTitle: 'Sign in' })),
  global,
  locale,
});
</script>

<template>
  <AuthForm
    mode="sign-in"
    :locale="locale"
    :logo="global?.navbar?.logo?.image"
  />
</template>
