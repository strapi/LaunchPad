'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { API_URL } from '@/lib/config';

/** Listens to the Strapi admin while embedded in Live Preview and refreshes on save. */
export function Preview() {
  const router = useRouter();
  useEffect(() => {
    const onMessage = (message: MessageEvent) => {
      const { origin, data } = message;
      if (origin !== API_URL) return;
      if (data?.type === 'strapiUpdate') router.refresh();
      else if (data?.type === 'strapiScript' && data.payload?.script) {
        const script = document.createElement('script');
        script.textContent = data.payload.script;
        document.head.appendChild(script);
      }
    };
    window.addEventListener('message', onMessage);
    window.parent?.postMessage({ type: 'previewReady' }, '*');
    return () => window.removeEventListener('message', onMessage);
  }, [router]);
  return null;
}
