import { Metadata } from 'next';

import ClientSlugHandler from './ClientSlugHandler';
import PageContent from '@/lib/shared/PageContent';
import { generateMetadataObject } from '@/lib/shared/metadata';
import { fetchCollectionType } from '@/lib/strapi';
import type { LocaleParamsProps } from '@/types/types';

export async function generateMetadata({
  params,
}: LocaleParamsProps): Promise<Metadata> {
  const { locale } = await params;

  const [pageData] = await fetchCollectionType('pages', {
    filters: {
      slug: {
        $eq: 'homepage',
      },
      locale: locale,
    },
  });

  const seo = pageData.seo;
  const metadata = generateMetadataObject(seo);
  return metadata;
}

export default async function HomePage({ params }: LocaleParamsProps) {
  const { locale } = await params;

  const [pageData] = await fetchCollectionType('pages', {
    filters: {
      slug: {
        $eq: 'homepage',
      },
      locale: locale,
    },
  });

  const localizedSlugs = pageData.localizations?.reduce(
    (acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = '';
      return acc;
    },
    { [locale]: '' }
  );

  return (
    <>
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <PageContent pageData={pageData} />
    </>
  );
}
