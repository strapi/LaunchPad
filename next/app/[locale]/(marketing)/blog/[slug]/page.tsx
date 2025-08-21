import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import React from 'react';

import ClientSlugHandler from '../../ClientSlugHandler';
import { BlogLayout } from '@/components/blog-layout';
import fetchContentType from '@/lib/strapi/fetchContentType';

export default async function SingleArticlePage(props: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const params = await props.params;
  const article = await fetchContentType(
    'articles',
    {
      filters: {
        slug: params.slug,
        locale: params.locale,
      },
    },
    true
  );

  if (!article) {
    return <div>Blog not found</div>;
  }

  const localizedSlugs = article.localizations?.reduce(
    (acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = localization.slug;
      return acc;
    },
    { [params.locale]: params.slug }
  );

  return (
    <BlogLayout article={article} locale={params.locale}>
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <BlocksRenderer content={article.content} />
    </BlogLayout>
  );
}
