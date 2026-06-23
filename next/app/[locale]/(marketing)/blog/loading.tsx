import { Container } from '@/components/container';
import {
  PageHeroSkeleton,
  SkeletonBlock,
} from '@/components/skeletons/page-skeleton';

export default function Loading() {
  return (
    <div className="relative overflow-hidden w-full">
      <Container className="flex flex-col items-center pb-20">
        <PageHeroSkeleton />

        {/* Featured article card */}
        <SkeletonBlock className="mt-16 aspect-[16/9] w-full max-w-5xl" />

        {/* Article rows */}
        <div className="w-full max-w-5xl mt-12 space-y-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex items-center gap-4">
              <SkeletonBlock className="h-20 w-32 shrink-0" />
              <div className="flex-1 space-y-3">
                <SkeletonBlock className="h-5 w-2/3" />
                <SkeletonBlock className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
