import { cn } from '@/lib/utils';

export function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded-md bg-neutral-800', className)} />
  );
}

/**
 * Mirrors the centered icon + heading + sub-heading hero shared by the
 * dynamic-zone pages (pricing), the products page and the blog page.
 * Uses the same `pt-40` offset so the skeleton clears the fixed navbar
 * instead of rendering underneath it.
 */
export function PageHeroSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col items-center pt-40', className)}>
      {/* Feature icon placeholder (matches FeatureIconContainer footprint) */}
      <SkeletonBlock className="h-14 w-14" />
      {/* Heading */}
      <SkeletonBlock className="mt-6 h-9 w-72 md:h-12 md:w-[28rem]" />
      {/* Sub-heading */}
      <SkeletonBlock className="mt-5 h-4 w-64 md:w-96" />
    </div>
  );
}
