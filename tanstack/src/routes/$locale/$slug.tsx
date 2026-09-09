import { createFileRoute, notFound } from '@tanstack/react-router';

import { NotFound } from '@/components/not-found';
import { PageSkeleton } from '@/components/skeletons/route-skeletons';
import { buildSeoMeta } from '@/lib/shared/metadata';
import PageContent from '@/lib/shared/page-content';

/**
 * Dynamic `pages` collection route — everything under /$locale/* that isn't
 * a hardcoded route (blog, products, sign-up) resolves here by slug.
 *
 * The loader additionally builds a `localizedSlugs` map that `LocaleSwitcher`
 * reads via `useMatches()` to preserve slug translations when switching
 * languages. Replaces Next's `ClientSlugHandler` + `SlugContext` pattern.
 */
export const Route = createFileRoute('/$locale/$slug')({
  loader: async ({ params, context }) => {
    const { data: page } = await context.strapiApi.page.getPageBySlug({
      data: { slug: params.slug, locale: params.locale },
    });
    if (!page) throw notFound();

    const localizedSlugs = (page.localizations ?? []).reduce(
      (acc: Record<string, string>, localization: any) => {
        acc[localization.locale] = localization.slug;
        return acc;
      },
      { [params.locale]: params.slug }
    );

    return { page, localizedSlugs };
  },
  head: ({ loaderData }) => ({
    meta: buildSeoMeta(loaderData?.page?.seo),
  }),
  notFoundComponent: () => (
    <NotFound
      title="Page not found"
      message="We couldn't find a page with that slug."
    />
  ),
  pendingComponent: PageSkeleton,
  component: SlugPage,
});

function SlugPage() {
  const { page } = Route.useLoaderData();
  return <PageContent pageData={page} />;
}
