import { useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';

import { API_URL } from '@/lib/utils';

/**
 * Strapi preview bridge.
 *
 * Mounted on every page. When tanpad runs inside Strapi's admin preview
 * iframe, this component:
 *
 *   1. Sends `{ type: 'previewReady' }` to the parent window on mount.
 *      This tells Strapi admin that the iframe is ready to receive its
 *      click-to-edit overlay script.
 *
 *   2. Listens for `{ type: 'strapiScript', payload: { script } }` from
 *      the Strapi origin. When received, it injects the script into
 *      `<head>`. That script wires up the field-click overlay that reads
 *      the invisible source-map markers (embedded by the
 *      `strapi-encode-source-maps` header) and navigates the Strapi admin
 *      to the clicked field's editor.
 *
 *   3. Listens for `{ type: 'strapiUpdate' }` from the Strapi origin.
 *      Fired when a content author edits a field in the admin — we
 *      invalidate all routes so loaders re-fetch and the preview shows
 *      the latest draft content without a full reload.
 *
 * Origin filtering (`origin !== API_URL`) prevents other iframes or
 * rogue postMessage sources from injecting scripts.
 *
 * Safe to mount outside of preview mode — in normal browsing, the parent
 * window is `window.top` and there's no listener on the other side, so
 * `postMessage` is a no-op.
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
        const script = document.createElement('script');
        script.textContent = data.payload.script;
        document.head.appendChild(script);
      }
    };

    window.addEventListener('message', handleMessage);

    // Let Strapi know we're ready to receive the overlay script.
    window.parent.postMessage({ type: 'previewReady' }, '*');

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [router]);

  return null;
};
