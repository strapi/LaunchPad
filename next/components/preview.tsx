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
        const src: string = data.payload.script;
        // Workaround for a Strapi bug: the production admin build's injected
        // live-preview highlight script calls a minified bundler helper — a
        // lazy-import wrapper around `import('@vercel/stega')`, e.g.
        // `await ye(async () => { ... })` (renamed to `be` and so on in later
        // builds) — that it never includes in the emitted script. The helper is
        // undefined at runtime, so the script throws
        // `ReferenceError: <name> is not defined`, its init promise rejects with
        // no catch, and click-to-edit never wires up (no overlay, no field
        // selection). It works under `strapi develop` because that build inlines
        // the helper. The name is minified and changes between Strapi builds, so
        // parse every `await NAME(async ...)` helper out of the script and define
        // each as a passthrough that just runs the factory. Helpers the script
        // defines locally simply shadow these globals, so this is safe. Remove
        // once Strapi ships a build that self-contains the helper.
        const w = window as unknown as Record<string, unknown>;
        for (const match of src.matchAll(
          /await\s+([A-Za-z_$][\w$]*)\s*\(\s*async/g
        )) {
          const name = match[1];
          if (typeof w[name] === 'undefined') {
            w[name] = (factory: () => unknown) => factory();
          }
        }
        const script = window.document.createElement('script');
        script.textContent = src;
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
