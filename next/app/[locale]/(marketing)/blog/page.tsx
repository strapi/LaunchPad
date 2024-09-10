import { type Metadata } from "next";
import { Container } from "@/components/container";
import { Heading } from "@/components/elements/heading";
import { Subheading } from "@/components/elements/subheading";
import { BlogCard } from "@/components/blog-card";
import { FeatureIconContainer } from "@/components/features/feature-icon-container";
import { IconClipboardText } from "@tabler/icons-react";
import seoData from "@/lib/next-metadata";
import { BlogPostRows } from "@/components/blog-post-rows";
import { AmbientColor } from "@/components/decorations/ambient-color";
import { BlogPost } from "contentlayer/generated";
import fetchContentType from "@/lib/strapi/fetchContentType";

export const metadata: Metadata = {
  title: "Blog | " + seoData.title,
  description: seoData.description,
  openGraph: {
    images: seoData.openGraph.images,
  },
};

export default async function Blog({
  params,
}: {
  params: { locale: string };
}) {
  const blogPage = await fetchContentType('blog-page', `filters[locale]=${params.locale}`, true)
  const articles = await fetchContentType('articles', '')

  return (
    <div className="relative overflow-hidden py-20 md:py-0">
      <AmbientColor />
      <Container className="flex flex-col items-center justify-between pb-20">
        <div className="relative z-20 py-10 md:pt-40">
          <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
            <IconClipboardText className="h-6 w-6 text-white" />
          </FeatureIconContainer>
          <Heading as="h1" className="mt-4">
            {blogPage.heading}
          </Heading>
          <Subheading className="max-w-3xl mx-auto">
            {blogPage.sub_heading}
          </Subheading>
        </div>

        {articles.data.slice(0, 1).map((article: BlogPost) => (
          <BlogCard blog={article} key={article.title} />
        ))}

        <BlogPostRows articles={articles.data} />
      </Container>
    </div>
  );
}
