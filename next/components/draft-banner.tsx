'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function DraftBanner({ label, exit }: { label: string; exit: string }) {
  const router = useRouter();
  const [inIframe, setInIframe] = useState(true);
  useEffect(() => setInIframe(window !== window.top), []);
  if (inIframe) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg bg-coral px-4 py-2 text-sm text-white shadow-lg">
      <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-white" />
      <span className="font-semibold">{label}</span>
      <button
        className="rounded bg-white/20 px-2 py-1 text-xs hover:bg-white/30"
        onClick={async () => { await fetch('/api/exit-preview'); router.refresh(); }}
      >
        {exit}
      </button>
    </div>
  );
}
