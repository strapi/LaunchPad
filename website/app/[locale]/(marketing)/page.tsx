import { Metadata } from 'next';

import PageContent from '@/lib/shared/PageContent';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { generateMetadataObject } from '@/lib/shared/metadata';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const pageData = await fetchContentType(
    'pages',
    `filters[slug][$eq]=homepage&filters[locale][$eq]=${params.locale}&populate=seo.metaImage`,
    true
  );

  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);
  return metadata;
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  const pageData = await fetchContentType(
    'pages',
    `filters[slug][$eq]=homepage&filters[locale][$eq]=${params.locale}`,
    true
  );

  return <PageContent pageData={pageData} />;
}
