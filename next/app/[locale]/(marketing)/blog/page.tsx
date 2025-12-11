import { IconClipboardText } from '@tabler/icons-react';
import { type Metadata } from 'next';

import ClientSlugHandler from '../ClientSlugHandler';
import { BlogCard } from '@/components/blog-card';
import { BlogPostRows } from '@/components/blog-post-rows';
import { Container } from '@/components/container';
import { AmbientColor } from '@/components/decorations/ambient-color';
import { FeatureIconContainer } from '@/components/dynamic-zone/features/feature-icon-container';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';
import { generateMetadataObject } from '@/lib/shared/metadata';
import { fetchCollectionType, fetchSingleType } from '@/lib/strapi';
import type { Article, LocaleParamsProps } from '@/types/types';

export async function generateMetadata({
  params,
}: LocaleParamsProps): Promise<Metadata> {
  const { locale } = await params;
  const pageData = await fetchSingleType('blog-page', { locale });

  const seo = pageData.seo;
  const metadata = generateMetadataObject(seo);
  return metadata;
}

export default async function Blog({ params }: LocaleParamsProps) {
  const { locale } = await params;
  const pageData = await fetchSingleType('blog-page', {
    locale: locale,
  });
  const [firstArticle, ...articles] = await fetchCollectionType<Article[]>(
    'articles',
    {
      filters: { locale: { $eq: locale } },
    }
  );

  const localizedSlugs = pageData.localizations.reduce(
    (acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = 'blog';
      return acc;
    },
    { [locale]: 'blog' }
  );

  return (
    <div className="relative overflow-hidden py-20 md:py-0">
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <AmbientColor />
      <Container className="flex flex-col items-center justify-between pb-20">
        <div className="relative z-20 py-10 md:pt-40">
          <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
            <IconClipboardText className="h-6 w-6 text-white" />
          </FeatureIconContainer>
          <Heading as="h1" className="mt-4">
            {pageData.heading}
          </Heading>
          <Subheading className="max-w-3xl mx-auto">
            {pageData.sub_heading}
          </Subheading>
        </div>

        <BlogCard
          article={firstArticle}
          locale={locale}
          key={firstArticle.title}
        />

        <BlogPostRows articles={articles} />
      </Container>
    </div>
  );
}
