import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/container";
import { Heading } from "@/components/elements/heading";
import { Subheading } from "@/components/elements/subheading";
import { AmbientColor } from "@/components/decorations/ambient-color";
import { FeatureIconContainer } from "@/components/features/feature-icon-container";
import { IconCheck, IconShoppingCart } from "@tabler/icons-react";
import { getAllProducts, getProduct, getRelatedProducts } from "@/lib/product";
import { formatNumber } from "@/lib/utils";
import { Button } from "@/components/elements/button";
import { ProductItems } from "@/components/products/product-items";
import AddToCartModal from "@/components/products/modal";
import { SingleProduct } from "@/components/products/single-product";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

import seoData from "@/lib/next-metadata";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: "Product Not Found | " + seoData.title,
      description: "The requested product could not be found.",
    };
  }

  return {
    title: `${product.title} | ${seoData.title}`,
    description: product.description || seoData.description,
    openGraph: {
      title: `${product.title} | ${seoData.openGraph.title}`,
      description: product.description || seoData.openGraph.description,
      images: product.images ? product.images : seoData.openGraph.images,
    },
  };
}

export default async function SingleProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);
  const relatedProducts = await getRelatedProducts(params.slug);
  if (!product) {
    redirect("/products");
  }

  return (
    <div className="relative overflow-hidden w-full">
      <AmbientColor />
      <Container className="py-20 md:py-40">
        <SingleProduct product={product} />
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-10">
            <ProductItems title="Related Products" products={relatedProducts} />
          </div>
        )}
      </Container>
    </div>
  );
}
