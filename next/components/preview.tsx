'use client';

import { API_URL } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
        // Workaround for a Strapi bug: the production admin build injects a
        // live-preview highlight script that calls a bundler helper `ye` (a
        // lazy-import wrapper around `import('@vercel/stega')`) but never
        // includes `ye` in the emitted script string. So the script throws
        // `ReferenceError: ye is not defined`, its init promise rejects with no
        // catch, and click-to-edit never wires up (no overlay, no field
        // selection). It works under `strapi develop` because the dev build
        // inlines the helper. Shim `ye` as a passthrough that just runs the
        // factory so the dynamic import resolves. Remove once Strapi ships a
        // build that self-contains the helper.
        const w = window as unknown as {
          ye?: (factory: () => unknown) => unknown;
        };
        if (typeof w.ye === 'undefined') {
          w.ye = (factory) => factory();
        }
        const script = window.document.createElement('script');
        script.textContent = data.payload.script;
        window.document.head.appendChild(script);
      }
    };

    // Add the event listener
    window.addEventListener('message', handleMessage);

    // Let Strapi know we're ready to receive the script
    window.parent?.postMessage({ type: 'previewReady' }, '*');

    // Remove the event listener on unmount
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [router]);

  return null;
};
