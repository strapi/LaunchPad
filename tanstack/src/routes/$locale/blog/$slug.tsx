import { createFileRoute, notFound } from '@tanstack/react-router';

import { ArticleContent } from '@/components/article-content';
import { BlogLayout } from '@/components/blog-layout';
import { NotFound } from '@/components/not-found';
import { ArticleSkeleton } from '@/components/skeletons/route-skeletons';
import { buildSeoMeta } from '@/lib/shared/metadata';

/**
 * Blog article detail route.
 *
 * Exposes `localizedSlugs` so LocaleSwitcher can navigate between
 * language variants of the same article (e.g.
 * `/en/blog/hello-world` ↔ `/fr/blog/bonjour-le-monde`).
 */
export const Route = createFileRoute('/$locale/blog/$slug')({
  loader: async ({ params, context }) => {
    const { data: article } = await context.strapiApi.articles.getArticleBySlug(
      {
        data: { slug: params.slug, locale: params.locale },
      }
    );
    if (!article) throw notFound();

    const localizedSlugs = (article.localizations ?? []).reduce(
      (acc: Record<string, string>, localization: any) => {
        acc[localization.locale] = `blog/${localization.slug}`;
        return acc;
      },
      { [params.locale]: `blog/${params.slug}` }
    );

    return { article, localizedSlugs };
  },
  head: ({ loaderData }) => ({
    meta: buildSeoMeta(loaderData?.article?.seo),
  }),
  notFoundComponent: () => (
    <NotFound
      title="Article not found"
      message="We couldn't find an article with that slug."
    />
  ),
  pendingComponent: ArticleSkeleton,
  component: ArticleDetail,
});

function ArticleDetail() {
  const { article } = Route.useLoaderData();
  const { locale } = Route.useParams();

  return (
    <BlogLayout article={article} locale={locale}>
      <ArticleContent content={article.content} />
    </BlogLayout>
  );
}
