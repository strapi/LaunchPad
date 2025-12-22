import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { Container } from '@/components/container';
import { AmbientColor } from '@/components/decorations/ambient-color';
import DynamicZoneManager from '@/components/dynamic-zone/manager';
import { SingleProduct } from '@/components/products/single-product';
import { generateMetadataObject } from '@/lib/shared/metadata';
import { fetchCollectionType } from '@/lib/strapi';
import type { Product } from '@/types/types';

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const [pageData] = await fetchCollectionType<Product[]>('products', {
    filters: { slug: { $eq: params.slug } },
  });

  const seo = pageData;
  const metadata = generateMetadataObject(seo);
  return metadata;
}

export default async function SingleProductPage(props: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const params = await props.params;

  const [pageData] = await fetchCollectionType<Product[]>('products', {
    filters: { slug: { $eq: params.slug } },
  });

  if (!pageData) {
    redirect('/products');
  }

  return (
    <div className="relative overflow-hidden w-full">
      <AmbientColor />
      <Container className="py-20 md:py-40">
        <SingleProduct product={pageData} />
        {pageData?.dynamic_zone && (
          <DynamicZoneManager
            dynamicZone={pageData?.dynamic_zone}
            locale={params.locale}
          />
        )}
      </Container>
    </div>
  );
}
