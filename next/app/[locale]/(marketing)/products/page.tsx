import { AmbientColor } from "@/components/decorations/ambient-color";
import { Container } from "@/components/container";
import { FeatureIconContainer } from "@/components/features/feature-icon-container";
import { Heading } from "@/components/elements/heading";
import { Featured } from "@/components/products/featured";
import { ProductItems } from "@/components/products/product-items";
import { Subheading } from "@/components/elements/subheading";
import seoData from "@/lib/next-metadata";
import { getAllProducts } from "@/lib/product";
import { IconShoppingCartUp } from "@tabler/icons-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | " + seoData.title,
  description: seoData.description,
  openGraph: {
    images: seoData.openGraph.images,
  },
};

export default async function Home() {
  const products = await getAllProducts();
  const featured = products.filter((product) => product.featured);
  return (
    <div className="relative overflow-hidden  w-full">
      <AmbientColor />
      <Container className="pt-40 pb-40">
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconShoppingCartUp className="h-6 w-6 text-white" />
        </FeatureIconContainer>
        <Heading as="h1" className="pt-4">
          Products
        </Heading>
        <Subheading className="max-w-3xl mx-auto">
          Buy products to supercharge your journey
        </Subheading>
        <Featured products={featured} />
        <ProductItems products={products} />
      </Container>
    </div>
  );
}
