import { Metadata } from 'next';

import ClientSlugHandler from './ClientSlugHandler';
import PageContent from '@/lib/shared/PageContent';
import { generateMetadataObject } from '@/lib/shared/metadata';
import { strapiClient } from '@/lib/strapi';
import fetchContentType from '@/lib/strapi/fetchContentType';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const { data: pageData } = await strapiClient.collection('pages').find({
    filters: {
      slug: 'homepage',
    },
    locale: params.locale,
  });

  // const pageData = await client.fetch('pages', {
  //   filters: { slug: 'homepage', locale: params.locale },
  // });

  // const pageData = await fetchContentType(
  //   'pages',
  //   {
  //     filters: {
  //       slug: 'homepage',
  //       locale: params.locale,
  //     },
  //     populate: 'seo.metaImage',
  //   },
  //   true
  // );

  const seo = pageData[0].seo;
  const metadata = generateMetadataObject(seo);
  return metadata;
}

export default async function HomePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { data } = await strapiClient.collection('pages').find({
    filters: {
      slug: 'homepage',
    },
    locale: params.locale,
  });
  const pageData = data[0];

  const localizedSlugs = pageData.localizations?.reduce(
    (acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = '';
      return acc;
    },
    { [params.locale]: '' }
  );

  return (
    <>
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <PageContent pageData={pageData} />
    </>
  );
}
