import { Container } from '@/components/container';
import {
  PageHeroSkeleton,
  SkeletonBlock,
} from '@/components/skeletons/page-skeleton';

// The `[slug]` route renders dynamic-zone pages (e.g. /pricing). This fallback
// mirrors the real Pricing layout: a centered hero followed by a 4-column grid
// of plan cards, so the skeleton lines up with the content that replaces it.
export default function Loading() {
  return (
    <div className="relative overflow-hidden w-full">
      <Container>
        <PageHeroSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto gap-4 py-20 lg:items-start">
          {[...Array(4)].map((_, index) => (
            <PlanCardSkeleton key={index} />
          ))}
        </div>
      </Container>
    </div>
  );
}

function PlanCardSkeleton() {
  return (
    <div className="p-4 rounded-3xl bg-neutral-900 border-2 border-neutral-800">
      <div className="p-4 bg-neutral-800 rounded-2xl">
        <SkeletonBlock className="h-5 w-28 bg-neutral-700" />
        <SkeletonBlock className="mt-8 h-10 w-32 bg-neutral-700" />
        <SkeletonBlock className="mt-10 mb-4 h-10 w-full bg-neutral-700" />
      </div>
      <div className="mt-1 p-4 space-y-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <SkeletonBlock className="h-4 w-4 rounded-full bg-neutral-700" />
            <SkeletonBlock className="h-4 flex-1 bg-neutral-700" />
          </div>
        ))}
      </div>
    </div>
  );
}
