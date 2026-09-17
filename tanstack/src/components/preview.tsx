import { useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';

import { API_URL } from '@/lib/utils';

const SCRIPT_ID = 'strapi-preview-script';
const QUIET_MS = 300;
const MAX_WAIT_MS = 5000;

/**
 * Runs `run` once the page has stopped changing underneath us.
 *
 * Strapi's overlay script rewrites the DOM the moment it executes: it decodes
 * the invisible stega markers out of text nodes and tags elements with
 * `data-strapi-source`. If that lands while the framework is still hydrating,
 * the hydrated markup no longer matches the server HTML, the tree is
 * regenerated, and the overlay and click handlers the script just installed
 * are thrown away — click-to-edit silently stops working.
 *
 * Mount effects are not a safe signal (this component renders null, so it
 * commits almost immediately), and neither is `load` — measured at ~209ms on a
 * draft article, well before hydration finished. There is no public
 * "hydration complete" event, so watch for the DOM going quiet instead.
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

/**
 * Strapi preview bridge.
 *
 * Mounted on every page. When this runs inside Strapi's admin preview iframe:
 *
 *   1. Sends `{ type: 'previewReady' }` to the parent once hydration settles.
 *   2. Listens for `{ type: 'strapiScript' }` from the Strapi origin and
 *      injects the click-to-edit overlay script.
 *   3. Listens for `{ type: 'strapiUpdate' }` and invalidates routes so the
 *      preview shows the latest draft without a full reload.
 *
 * Origin filtering (`origin !== API_URL`) prevents other frames from injecting.
 *
 * Safe to mount outside preview mode — the parent is `window.top`, nothing
 * listens, and `postMessage` is a no-op.
 */
export const Preview = () => {
  const router = useRouter();

  useEffect(() => {
    const handleMessage = (message: MessageEvent<any>) => {
      const { origin, data } = message;

      if (origin !== API_URL) {
        return;
      }

      if (data?.type === 'strapiUpdate') {
        router.invalidate();
      } else if (data?.type === 'strapiScript') {
        // StrictMode mounts effects twice in development, so the handshake can
        // run twice and Strapi answers every previewReady. Injecting the script
        // twice leaves two overlays competing for the same elements.
        if (document.getElementById(SCRIPT_ID)) {
          return;
        }

        const script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.textContent = data.payload.script;
        document.head.appendChild(script);
      }
    };

    window.addEventListener('message', handleMessage);

    const cancelReady = whenSettled(() => {
      window.parent.postMessage({ type: 'previewReady' }, '*');
    });

    return () => {
      cancelReady();
      window.removeEventListener('message', handleMessage);
    };
  }, [router]);

  return null;
};
