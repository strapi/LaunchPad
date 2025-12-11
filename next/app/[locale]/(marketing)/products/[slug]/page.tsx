import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { Container } from '@/components/container';
import { AmbientColor } from '@/components/decorations/ambient-color';
import DynamicZoneManager from '@/components/dynamic-zone/manager';
import { SingleProduct } from '@/components/products/single-product';
import { generateMetadataObject } from '@/lib/shared/metadata';
import { fetchCollectionType } from '@/lib/strapi';
import type { LocaleSlugParamsProps, Product } from '@/types/types';

export async function generateMetadata({
  params,
}: LocaleSlugParamsProps): Promise<Metadata> {
  const { slug } = await params;

  const [pageData] = await fetchCollectionType<Product[]>('products', {
    filters: { slug: { $eq: slug } },
  });

  const seo = pageData;
  const metadata = generateMetadataObject(seo);
  return metadata;
}

export default async function SingleProductPage({
  params,
}: LocaleSlugParamsProps) {
  const { slug, locale } = await params;

  const [pageData] = await fetchCollectionType<Product[]>('products', {
    filters: { slug: { $eq: slug } },
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
            locale={locale}
          />
        )}
      </Container>
    </div>
  );
}
