import { Metadata } from 'next';
import React from 'react';

import { generateMetadataObject } from '@/lib/shared/metadata';
import fetchContentType from '@/lib/strapi/fetchContentType';
import ClientSlugHandler from '../ClientSlugHandler';
import PageContent from '@/lib/shared/PageContent';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const pageData = await fetchContentType(
    'pages',
    {
      filters: { slug: 'services' },
      populate: 'seo.metaImage',
    },
    true
  );

  const seo = pageData?.seo;
  return generateMetadataObject(seo);
}

export default async function Services(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  // Fetch les donnees et recuperer les data de services
  const servicePage = await fetchContentType(
    'pages',
    {
      filters: {
        slug: 'services',
        locale: params.locale,
      },
    },
    true
  );

  const localizedSlugs = servicePage?.localizations?.reduce(
    (acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = localization.slug;
      return acc;
    },
    { [params.locale]: 'services' }
  );

  console.log('Donnees venant du Backend : ', servicePage);

  return (
    <>
          <ClientSlugHandler localizedSlugs={localizedSlugs} />
          <PageContent pageData={servicePage} />
        </>
  )
}
