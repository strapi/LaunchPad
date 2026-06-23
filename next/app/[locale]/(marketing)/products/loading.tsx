import { Container } from '@/components/container';
import {
  PageHeroSkeleton,
  SkeletonBlock,
} from '@/components/skeletons/page-skeleton';

export default function Loading() {
  return (
    <div className="relative overflow-hidden w-full">
      <Container className="pb-40">
        <PageHeroSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-16">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="space-y-3">
              <SkeletonBlock className="aspect-square w-full" />
              <SkeletonBlock className="h-5 w-3/4" />
              <SkeletonBlock className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
