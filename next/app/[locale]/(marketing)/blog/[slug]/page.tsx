import { Metadata } from 'next';

import { BlogLayout } from "@/components/blog-layout";
import fetchContentType from "@/lib/strapi/fetchContentType";
import { BlocksRenderer } from '@strapi/blocks-react-renderer';

import { generateMetadataObject } from '@/lib/shared/metadata';

export async function generateMetadata({
  params,
}: {
  params: { locale: string, slug: string };
}): Promise<Metadata> {
  const pageData = await fetchContentType("articles", `filters[slug]=${params?.slug}&filters[locale][$eq]=${params.locale}&populate=seo.metaImage`, true)

  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);
  return metadata;
}

export default async function singleArticlePage({ params }: { params: { slug: string, locale: string } }) {
  const article = await fetchContentType("articles", `filters[slug]=${params?.slug}&filters[locale][$eq]=${params.locale}`, true)

  if (!article) {
    return <div>Blog not found</div>;
  }

  return (
    <BlogLayout article={article} locale={params.locale}>
      <BlocksRenderer content={article.content} />
    </BlogLayout>
  );
}