import { Metadata } from 'next';

import { AmbientColor } from "@/components/decorations/ambient-color";
import { Container } from "@/components/container";
import { FeatureIconContainer } from "@/components/dynamic-zone/features/feature-icon-container";
import { Heading } from "@/components/elements/heading";
import { Featured } from "@/components/products/featured";
import { ProductItems } from "@/components/products/product-items";
import { Subheading } from "@/components/elements/subheading";
import { IconShoppingCartUp } from "@tabler/icons-react";
import fetchContentType from "@/lib/strapi/fetchContentType";
import { generateMetadataObject } from '@/lib/shared/metadata';

import ClientSlugHandler from '../ClientSlugHandler';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {

  const pageData = await fetchContentType("product-page", {
    filters: {
      locale: params.locale,
    },
    populate: "seo.metaImage",
  }, true)

  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);
  return metadata;
}

export default async function Products({
  params,
}: {
  params: { locale: string };
}) {

  // Fetch the product-page and products data
  const productPage = await fetchContentType('product-page', {
    filters: {
      locale: params.locale,
    },
  }, true);
  const products = await fetchContentType('products');

  const localizedSlugs = productPage.localizations?.reduce(
    (acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = "products";
      return acc;
    },
    { [params.locale]: "products" }
  );
  const featured = products?.data.filter((product: { featured: boolean }) => product.featured);

  return (
    <div className="relative overflow-hidden w-full">
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <AmbientColor />
      <Container className="pt-40 pb-40">
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconShoppingCartUp className="h-6 w-6 text-white" />
        </FeatureIconContainer>
        <Heading as="h1" className="pt-4">
          {productPage.heading}
        </Heading>
        <Subheading className="max-w-3xl mx-auto">
          {productPage.sub_heading}
        </Subheading>
        <Featured products={featured} locale={params.locale} />
        <ProductItems products={products?.data} locale={params.locale} />
      </Container>
    </div>
  );
}
