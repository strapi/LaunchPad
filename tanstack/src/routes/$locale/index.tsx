import { createFileRoute, notFound } from '@tanstack/react-router';

import { buildSeoMeta } from '@/lib/shared/metadata';
import PageContent from '@/lib/shared/page-content';

export const Route = createFileRoute('/$locale/')({
  loader: async ({ params, context }) => {
    const { data: page } = await context.strapiApi.page.getPageBySlug({
      data: { slug: 'homepage', locale: params.locale },
    });
    if (!page) throw notFound();

    // For the homepage, every locale's slug maps to '' (the root URL).
    // This lets LocaleSwitcher navigate /en → /fr correctly via useMatches().
    const localizedSlugs = (page.localizations ?? []).reduce(
      (acc: Record<string, string>, localization: any) => {
        acc[localization.locale] = '';
        return acc;
      },
      { [params.locale]: '' }
    );

    return { page, localizedSlugs };
  },
  head: ({ loaderData }) => ({
    meta: buildSeoMeta(loaderData?.page?.seo),
  }),
  component: HomePage,
});

function HomePage() {
  const { page } = Route.useLoaderData();
  return <PageContent pageData={page} />;
}
