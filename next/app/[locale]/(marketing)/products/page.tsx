import { AmbientColor } from "@/components/decorations/ambient-color";
import { Container } from "@/components/container";
import { FeatureIconContainer } from "@/components/features/feature-icon-container";
import { Heading } from "@/components/elements/heading";
import { Featured } from "@/components/products/featured";
import { ProductItems } from "@/components/products/product-items";
import { Subheading } from "@/components/elements/subheading";
import seoData from "@/lib/next-metadata";
import { IconShoppingCartUp } from "@tabler/icons-react";
import { Metadata } from "next";
import fetchContentType from "@/lib/strapi/fetchContentType";

export const metadata: Metadata = {
  title: "Products | " + seoData.title,
  description: seoData.description,
  openGraph: {
    images: seoData.openGraph.images,
  },
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  plans: any[];
  perks: any[];
  featured?: boolean;
  images: any[];
  categories?: any[];
};

export default async function Products({
  params,
}: {
  params: { locale: string };
}) {
  const productPage = await fetchContentType('product-page', `filters[locale]=${params.locale}`, true)
  const products = await fetchContentType('products', '')

  const featured = products?.data.filter((product: { featured: boolean; }) => product.featured);
  return (
    <div className="relative overflow-hidden  w-full">
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
        <Featured products={featured} />
        <ProductItems products={products?.data} />
      </Container>
    </div>
  );
}
