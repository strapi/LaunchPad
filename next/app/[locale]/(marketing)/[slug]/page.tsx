import PageContent from '@/lib/shared/PageContent';
import fetchContentType from '@/lib/strapi/fetchContentType';

export default async function Page({ params }: { params: { locale: string, slug: string } }) {
  const pageData = await fetchContentType(
    'pages',
    `filters[slug][$eq]=${params.slug}&filters[locale][$eq]=${params.locale}`
  );

  return <PageContent pageData={pageData} />;
}
