import { IconClipboardText } from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';

import { BlogCard } from '@/components/blog-card';
import { BlogPostRows } from '@/components/blog-post-rows';
import { Container } from '@/components/container';
import { AmbientColor } from '@/components/decorations/ambient-color';
import { FeatureIconContainer } from '@/components/dynamic-zone/features/feature-icon-container';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';
import { BlogListSkeleton } from '@/components/skeletons/route-skeletons';
import { buildSeoMeta } from '@/lib/shared/metadata';

export const Route = createFileRoute('/$locale/blog/')({
  loader: async ({ params, context }) => {
    const [blogPage, articlesResponse] = await Promise.all([
      context.strapiApi.articles.getBlogPageData({
        data: { locale: params.locale },
      }),
      context.strapiApi.articles.getArticles({
        data: { locale: params.locale },
      }),
    ]);

    const pageData = blogPage.data;
    const articles = articlesResponse.data;

    // Localized-slug map so LocaleSwitcher works on /blog
    const localizedSlugs = (pageData?.localizations ?? []).reduce(
      (acc: Record<string, string>, localization: any) => {
        acc[localization.locale] = 'blog';
        return acc;
      },
      { [params.locale]: 'blog' }
    );

    return { pageData, articles, localizedSlugs };
  },
  head: ({ loaderData }) => ({
    meta: buildSeoMeta(loaderData?.pageData?.seo),
  }),
  pendingComponent: BlogListSkeleton,
  component: BlogIndex,
});

function BlogIndex() {
  const { pageData, articles } = Route.useLoaderData();
  const { locale } = Route.useParams();

  const [firstArticle, ...rest] = articles;

  return (
    <div className="relative overflow-hidden py-20 md:py-0">
      <AmbientColor />
      <Container className="flex flex-col items-center justify-between pb-20">
        <div className="relative z-20 py-10 md:pt-40">
          <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
            <IconClipboardText className="h-6 w-6 text-white" />
          </FeatureIconContainer>
          <Heading as="h1" className="mt-4">
            {pageData?.heading}
          </Heading>
          <Subheading className="max-w-3xl mx-auto">
            {pageData?.sub_heading}
          </Subheading>
        </div>

        {firstArticle && (
          <BlogCard
            article={firstArticle}
            locale={locale}
            key={firstArticle.title}
          />
        )}

        <BlogPostRows articles={rest} locale={locale} />
      </Container>
    </div>
  );
}
