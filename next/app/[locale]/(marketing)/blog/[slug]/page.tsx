import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import React from 'react';

import ClientSlugHandler from '../../ClientSlugHandler';
import { BlogLayout } from '@/components/blog-layout';
import { fetchCollectionType } from '@/lib/strapi';
import type { Article, LocaleSlugParamsProps } from '@/types/types';

export default async function SingleArticlePage({
  params,
}: LocaleSlugParamsProps) {
  const { slug, locale } = await params;
  const [article] = await fetchCollectionType<Article[]>('articles', {
    filters: {
      slug: {
        $eq: slug,
      },
    },
  });

  if (!article) {
    return <div>Blog not found</div>;
  }

  const localizedSlugs = article.localizations.reduce(
    (acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = localization.slug;
      return acc;
    },
    { [locale]: slug }
  );

  return (
    <BlogLayout article={article} locale={locale}>
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <BlocksRenderer content={article.content} />
    </BlogLayout>
  );
}
