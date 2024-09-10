import { BlogLayout } from "@/components/blog-layout";
import fetchContentType from "@/lib/strapi/fetchContentType";
import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer';

export default async function singleArticlePage({ params }: { params: { slug: string, locale: string } }) {
  const article = await fetchContentType("articles", `filters[slug]=${params?.slug}&filters[locale][$eq]=${params.locale}`, true)

  if (!article) {
    return <div>Blog not found</div>;
  }

  return (
    <BlogLayout article={article}>
      <BlocksRenderer content={article.content} />;
    </BlogLayout>
  );
}