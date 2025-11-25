"use client";

import { useSubscription } from "@/hooks/use-subscription";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function AIAnnouncement() {
  const { subscriptionStatus, isPending } = useSubscription();
  const isPro = subscriptionStatus?.isSubscribed ?? false;

  if (isPending || isPro) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/pricing"
        className="group bg-muted flex items-center justify-between gap-2 rounded-full px-2 py-1.5 shadow-sm transition-all duration-200 hover:shadow-md"
      >
        <span className="text-muted-foreground group-hover:text-foreground text-sm font-medium transition-colors">
          Upgrade to Pro for unlimited requests
        </span>

        <ArrowRight className="text-muted-foreground group-hover:text-foreground size-4 -rotate-45 transition-all group-hover:rotate-0" />
      </Link>
    </div>
  );
}
