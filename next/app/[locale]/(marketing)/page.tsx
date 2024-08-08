import PageContent from '@/lib/shared/PageContent';
import fetchContentType from '@/lib/strapi/fetchContentType';

export default async function LocaleRootPage({ params }: { params: { locale: string } }) {
  const pageData = await fetchContentType(
    'pages',
    `filters[slug][$eq]=homepage&filters[locale][$eq]=${params.locale}`,
    true
  );

  return <PageContent pageData={pageData} />;
}
