<script setup lang="ts">
/**
 * Strapi preview bridge.
 *
 * When the site runs inside Strapi's admin preview iframe this:
 *   1. announces readiness so the admin sends its click-to-edit overlay script
 *   2. injects that script when it arrives
 *   3. reloads on `strapiUpdate`, so a save in the admin shows up here
 *
 * Origin-checked against the Strapi URL, so no other frame can inject a script.
 *
 * Safe to mount always: outside an iframe `window.parent` is `window`, the
 * postMessage goes nowhere, and no listener ever fires.
 */
const strapiUrl = useStrapiUrl();

const SCRIPT_ID = 'strapi-preview-script';
const QUIET_MS = 300;
const MAX_WAIT_MS = 5000;

let cancelReady: (() => void) | undefined;

const handleMessage = (message: MessageEvent) => {
  if (message.origin !== strapiUrl) return;

  const data = message.data as
    | { type?: string; payload?: { script?: string } }
    | undefined;
  if (!data || typeof data !== 'object') return;

  if (data.type === 'strapiUpdate') {
    // The page is server-rendered per request in draft mode, so a reload is
    // enough to pick up the saved content.
    window.location.reload();
  } else if (data.type === 'strapiScript' && data.payload?.script) {
    // The admin answers every previewReady, so guard against a second inject
    // leaving two overlays competing for the same elements.
    if (document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.textContent = data.payload.script;
    document.head.appendChild(script);
  }
};

/**
 * Runs `run` once the page has stopped changing underneath us.
 *
 * Strapi's overlay script rewrites the DOM the moment it executes: it decodes
 * the invisible stega markers out of text nodes and tags elements with
 * `data-strapi-source`. If that lands while Vue is still hydrating, the
 * hydrated markup no longer matches the server HTML, the tree is patched or
 * regenerated, and the overlay and handlers the script just installed are lost
 * — click-to-edit silently stops working.
 *
 * `onMounted` is not a safe signal (this component renders a single hidden
 * span, so it mounts almost immediately), and neither is `load`. There is no
 * public "hydration complete" event, so watch for the DOM going quiet instead.
 */
const whenSettled = (run: () => void): (() => void) => {
  let quiet: ReturnType<typeof setTimeout> | undefined;
  let cap: ReturnType<typeof setTimeout> | undefined;
  let observer: MutationObserver | undefined;
  let done = false;

  const finish = () => {
    if (done) return;
    done = true;
    clearTimeout(quiet);
    clearTimeout(cap);
    observer?.disconnect();
    run();
  };

  const start = () => {
    if (done) return;
    // Hydration shows up as childList/characterData churn. Attributes are
    // deliberately excluded: animation libraries write inline styles every
    // frame, so watching them would mean the page never looks quiet.
    observer = new MutationObserver(() => {
      clearTimeout(quiet);
      quiet = setTimeout(finish, QUIET_MS);
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    quiet = setTimeout(finish, QUIET_MS);
    cap = setTimeout(finish, MAX_WAIT_MS);
  };

  if (document.readyState === 'complete') {
    start();
  } else {
    window.addEventListener('load', start, { once: true });
  }

  return () => {
    done = true;
    clearTimeout(quiet);
    clearTimeout(cap);
    observer?.disconnect();
    window.removeEventListener('load', start);
  };
};

onMounted(() => {
  window.addEventListener('message', handleMessage);
  cancelReady = whenSettled(() => {
    window.parent.postMessage({ type: 'previewReady' }, '*');
  });
});

onBeforeUnmount(() => {
  cancelReady?.();
  window.removeEventListener('message', handleMessage);
});
</script>

<template><span class="hidden" aria-hidden="true" /></template>
