'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export function DraftModeBanner() {
  const router = useRouter();
  const pathname = usePathname();
  const [isExiting, setIsExiting] = useState(false);

  const handleExitDraft = async () => {
    setIsExiting(true);
    try {
      await fetch('/api/exit-preview');
      router.refresh();
    } catch (error) {
      console.error('Failed to exit draft mode:', error);
      setIsExiting(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-secondary text-black px-6 py-3 rounded-lg shadow-lg flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="inline-block w-4 h-4 bg-black rounded-full animate-pulse" />
        <span className="font-semibold">Draft Mode</span>
      </div>
      <button
        onClick={handleExitDraft}
        disabled={isExiting}
        className="bg-black text-white px-4 py-1 rounded text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
      >
        {isExiting ? 'Exiting...' : 'Exit Draft'}
      </button>
    </div>
  );
}