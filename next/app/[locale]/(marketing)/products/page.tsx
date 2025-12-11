import { IconShoppingCartUp } from '@tabler/icons-react';
import { Metadata } from 'next';

import ClientSlugHandler from '../ClientSlugHandler';
import { Container } from '@/components/container';
import { AmbientColor } from '@/components/decorations/ambient-color';
import { FeatureIconContainer } from '@/components/dynamic-zone/features/feature-icon-container';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';
import { Featured } from '@/components/products/featured';
import { ProductItems } from '@/components/products/product-items';
import { generateMetadataObject } from '@/lib/shared/metadata';
import { fetchCollectionType, fetchSingleType } from '@/lib/strapi';
import { LocaleParamsProps, Product } from '@/types/types';

export async function generateMetadata({
  params,
}: LocaleParamsProps): Promise<Metadata> {
  const { locale } = await params;
  const pageData = await fetchSingleType('product-page', { locale });

  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);
  return metadata;
}

export default async function Products({ params }: LocaleParamsProps) {
  const { locale } = await params;

  // Fetch the product-page and products data
  const pageData = await fetchSingleType('product-page', { locale });
  const products = await fetchCollectionType<Product[]>('products');

  const localizedSlugs = pageData.localizations.reduce(
    (acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = 'products';
      return acc;
    },
    { [locale]: 'products' }
  );
  const featured = products.filter(
    (product: { featured?: boolean }) => product.featured
  );

  return (
    <div className="relative overflow-hidden w-full">
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <AmbientColor />
      <Container className="pt-40 pb-40">
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconShoppingCartUp className="h-6 w-6 text-white" />
        </FeatureIconContainer>
        <Heading as="h1" className="pt-4">
          {pageData.heading}
        </Heading>
        <Subheading className="max-w-3xl mx-auto">
          {pageData.sub_heading}
        </Subheading>
        <Featured products={featured} locale={locale} />
        <ProductItems products={products} locale={locale} />
      </Container>
    </div>
  );
}
