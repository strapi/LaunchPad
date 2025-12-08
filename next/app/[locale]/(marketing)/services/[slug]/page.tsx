import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react';

import { Container } from '@/components/container';
import { AmbientColor } from '@/components/decorations/ambient-color';
import DynamicZoneManager from '@/components/dynamic-zone/manager';
import { generateMetadataObject } from '@/lib/shared/metadata';
import fetchContentType from '@/lib/strapi/fetchContentType';

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const pageData = await fetchContentType(
    'pages',
    {
      filters: { slug: params.slug },
      populate: 'seo.metaImage',
    },
    true
  );

  const seo = pageData?.seo;
  return generateMetadataObject(seo);
}


export default async function SinglePage(props: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const params = await props.params;

  // Fetch la page services et les differents services
  const page = await fetchContentType(
    'pages',
    {
      filters: { slug: params.slug },
      populate: 'deep',
    },
    true
  );

  console.log("Page data :", page);

  if (!page) redirect('/');

  return (
    <div className="relative overflow-hidden w-full">
      <AmbientColor />
      <Container className="py-20 md:py-40">
        {page.dynamic_zone && (
          <DynamicZoneManager
            dynamicZone={page.dynamic_zone}
            locale={params.locale}
          />
        )}
      </Container>
    </div>
  );
}

