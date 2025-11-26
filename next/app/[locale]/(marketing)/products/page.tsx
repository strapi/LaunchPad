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
import { getSingleType } from '@/lib/strapi';
import fetchContentType from '@/lib/strapi/fetchContentType';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const pageData = await getSingleType('product-page', {
    locale: params.locale,
  });

  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);
  return metadata;
}

export default async function Products(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  // Fetch the product-page and products data
  const pageData = await getSingleType('product-page', {
    locale: params.locale,
  });
  const products = await fetchContentType('products');

  const localizedSlugs = pageData.localizations?.reduce(
    (acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = 'products';
      return acc;
    },
    { [params.locale]: 'products' }
  );
  const featured = products?.data.filter(
    (product: { featured: boolean }) => product.featured
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
        <Featured products={featured} locale={params.locale} />
        <ProductItems products={products?.data} locale={params.locale} />
      </Container>
    </div>
  );
}
