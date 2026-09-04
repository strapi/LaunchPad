import { PageHeroSkeleton, SkeletonBlock } from './page-skeleton';
import { Container } from '@/components/container';

/**
 * Per-route pending UI, wired up as each route's `pendingComponent`.
 *
 * These are the TanStack equivalents of the Next launchpad's `loading.tsx`
 * files — same layouts, so a navigation shows the shape of the page that's
 * about to replace it rather than a blank screen.
 */

/** `/$locale/$slug` — dynamic-zone pages, e.g. /pricing. */
export function PageSkeleton() {
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

/** `/$locale/blog` — featured card above a list of article rows. */
export function BlogListSkeleton() {
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

/** `/$locale/blog/$slug` — title, meta, hero image, body copy. */
export function ArticleSkeleton() {
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
            {[
              'w-full',
              'w-11/12',
              'w-10/12',
              'w-full',
              'w-9/12',
              'w-11/12',
            ].map((width, index) => (
              <SkeletonBlock key={index} className={`h-4 ${width}`} />
            ))}
          </div>
        </article>
      </Container>
    </div>
  );
}

/** `/$locale/products` — hero above a grid of product cards. */
export function ProductListSkeleton() {
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

/** `/$locale/products/$slug` — image beside the detail column. */
export function ProductSkeleton() {
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
