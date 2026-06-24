import { Container } from '@/components/container';
import { SkeletonBlock } from '@/components/skeletons/page-skeleton';

export default function Loading() {
  return (
    <div className="relative overflow-hidden w-full">
      <Container className="pt-40 pb-20">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Image */}
          <SkeletonBlock className="aspect-square w-full" />

          {/* Details */}
          <div className="space-y-6">
            <SkeletonBlock className="h-10 w-3/4" />
            <SkeletonBlock className="h-6 w-1/4" />
            <div className="space-y-2">
              {[...Array(4)].map((_, index) => (
                <SkeletonBlock key={index} className="h-4 w-full" />
              ))}
            </div>
            <SkeletonBlock className="h-12 w-40" />
          </div>
        </div>
      </Container>
    </div>
  );
}
