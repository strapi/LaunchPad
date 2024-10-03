"use client";

import { useRouter } from "next/navigation";

export function DraftBanner() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center p-4 gap-6">
      <span>You are using the draft mode</span>
      <button
        onClick={(e) => {
          e.preventDefault();
          fetch("/api/exit-preview").then(() => {
            router.refresh();
          });
        }}
        className="outline p-2 rounded"
      >
        Exit draft mode
      </button>
    </div>
  );
}
