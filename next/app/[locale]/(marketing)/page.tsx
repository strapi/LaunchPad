import { Metadata } from 'next';

import PageContent from '@/lib/shared/PageContent';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { generateMetadataObject } from '@/lib/shared/metadata';
import ClientSlugHandler from './ClientSlugHandler';
import {fetchContent} from '@croct/plug-next/server';
import {VersionedSlotId} from '@croct/plug-next';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {

  const pageData = await fetchContentType(
    'pages',
    {
      filters: {
        slug: "homepage",
        locale: params.locale,
      },
      populate: "seo.metaImage",
    },
    true
  );

  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);
  return metadata;
}

const slug = 'homepage';

export default async function HomePage({ params }: { params: { locale: string } }) {
  const [staticPageData, slots = []] = await Promise.all([
    await fetchContentType(
      'pages',
      {
        filters: {
          slug: slug,
          locale: params.locale,
        },
      },
      true,
    ),
    fetchContent('dynamic-zone-map@1', { static: true })
      .then(({content}) => content.map.find((map) => map.slug === slug)?.sections)
  ]);

  const componentIndex: Record<string, number> = {};

  const dynamicZones = await Promise.all(
    (staticPageData.dynamic_zone as Array<{__component: string}>).map(async zone => {
      const componentId = zone.__component.slice(zone.__component.indexOf('.') + 1);

      componentIndex[componentId] = (componentIndex[componentId] ?? -1) + 1;

      const positionalComponentId = `${componentId}-${componentIndex[componentId]}`;

      const mapping = slots.find(entry => entry.component === positionalComponentId)
        ?? slots.find(entry => entry.component === componentId);

      if (mapping !== undefined) {
        return {
          ...zone,
          ...(await fetchContent(mapping.slot as VersionedSlotId, {
            preferredLocale: params.locale,
            fallback: zone,
          })).content,
        };
      }

      return zone;
    }),
  );

  const localizedSlugs = staticPageData.localizations?.reduce(
    (acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = "";
      return acc;
    },
    { [params.locale]: "" }
  );

  return <>
    <ClientSlugHandler localizedSlugs={localizedSlugs} />
    <PageContent pageData={{...staticPageData, dynamic_zone: dynamicZones}} />
  </>;
}
