import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { Container } from '@/components/container';
import ClientSlugHandler from '../../ClientSlugHandler';
import { AmbientColor } from '@/components/decorations/ambient-color';
import DynamicZoneManager from '@/components/dynamic-zone/manager';
import { SingleProduct } from '@/components/products/single-product';
import { generateMetadataObject } from '@/lib/shared/metadata';
import { fetchCollectionType, fetchSingleType } from '@/lib/strapi';
import type { LocaleSlugParamsProps, Product } from '@/types/types';

export async function generateMetadata({
  params,
}: LocaleSlugParamsProps): Promise<Metadata> {
  const { slug, locale } = await params;

  const [pageData] = await fetchCollectionType<Product[]>('products', {
    filters: { slug: { $eq: slug } },
    locale,
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
    locale,
  });

  const globalData = await fetchSingleType('global', { locale });

  if (!pageData) {
    redirect('/products');
  }

  const localizedSlugs = pageData.localizations?.reduce(
    (acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = localization.slug;
      return acc;
    },
    { [locale]: slug }
  ) || {};

  return (
    <div className="relative overflow-hidden w-full">
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <AmbientColor />
      <Container className="py-20 md:py-40">
        <SingleProduct
          product={pageData}
          locale={locale}
          addToCartText={globalData.add_to_cart}
          buyNowText={globalData.buy_now}
        />
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
