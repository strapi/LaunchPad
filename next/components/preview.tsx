'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { API_URL } from '@/lib/utils';

const SCRIPT_ID = 'strapi-preview-script';

/**
 * Runs `run` once the page has stopped changing underneath us.
 *
 * Strapi's visual-editing script rewrites the DOM the moment it executes: it
 * decodes the invisible stega markers out of text nodes and tags elements with
 * `data-strapi-source`. If that lands while React is still hydrating, React
 * sees markup that no longer matches the server HTML, reports a mismatch and
 * regenerates the subtree — throwing away the overlay and handlers the script
 * just installed.
 *
 * `useEffect` alone is not a safe signal: <Preview /> renders null from the
 * root layout, so its effect commits almost immediately while the rest of the
 * tree is still streaming. Neither is `load` — measured at 276ms on a draft
 * article page, well before hydration finished. React exposes no public
 * "hydration complete" event, so we watch for the DOM going quiet instead.
 */
const QUIET_MS = 300;
const MAX_WAIT_MS = 5000;

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
    // deliberately excluded: framer-motion animates inline styles constantly,
    // so watching them would mean the page never looks quiet.
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
    // Never strand the preview if something mutates forever.
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

export const Preview = () => {
  const router = useRouter();

  useEffect(() => {
    const handleMessage = async (message: MessageEvent<any>) => {
      const { origin, data } = message;

      if (origin !== API_URL) {
        return;
      }

      if (data.type === 'strapiUpdate') {
        router.refresh();
      } else if (data.type === 'strapiScript') {
        // StrictMode mounts effects twice in development, so the handshake can
        // run twice and Strapi answers every previewReady. Injecting the script
        // twice leaves two overlays competing for the same elements.
        if (window.document.getElementById(SCRIPT_ID)) {
          return;
        }

        const script = window.document.createElement('script');
        script.id = SCRIPT_ID;
        script.textContent = data.payload.script;
        window.document.head.appendChild(script);
      }
    };

    window.addEventListener('message', handleMessage);

    // Tell Strapi we're ready for the script, but only once hydration is done.
    const cancelReady = whenSettled(() => {
      window.parent?.postMessage({ type: 'previewReady' }, '*');
    });

    return () => {
      cancelReady();
      window.removeEventListener('message', handleMessage);
    };
  }, [router]);

  return null;
};
