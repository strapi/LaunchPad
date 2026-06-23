import { Container } from '@/components/container';
import { SkeletonBlock } from '@/components/skeletons/page-skeleton';

export default function Loading() {
  return (
    <div className="relative overflow-hidden w-full">
      <Container className="pt-40 pb-20">
        <article className="max-w-4xl mx-auto">
          {/* Title */}
          <SkeletonBlock className="h-12 w-3/4 mb-4" />

          {/* Meta info */}
          <div className="flex gap-4 mb-8">
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-4 w-32" />
          </div>

          {/* Featured image */}
          <SkeletonBlock className="aspect-video w-full mb-8" />

          {/* Content */}
          <div className="space-y-4">
            {['w-full', 'w-11/12', 'w-10/12', 'w-full', 'w-9/12', 'w-11/12'].map(
              (width, index) => (
                <SkeletonBlock key={index} className={`h-4 ${width}`} />
              )
            )}
          </div>
        </article>
      </Container>
    </div>
  );
}
