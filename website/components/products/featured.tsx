import React from "react";
import Image from "next/image";
import { formatNumber } from "@/lib/utils";
import { Link } from "next-view-transitions";
import { Product } from "@/types/types";
import { strapiImage } from "@/lib/strapi/strapiImage";

export const Featured = ({ products, locale }: { products: Product[], locale: string }) => {
  return (
    <div className="py-20">
      <h2 className="text-2xl md:text-4xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-white to-white mb-2">
        Featured
      </h2>
      <p className="text-neutral-500 text-lg mt-4 mb-10">
        Pick from our most popular collection
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3  gap-10">
        <div className="md:col-span-2">
          <FeaturedItem product={products[0]} locale={locale} />
        </div>
        <div className="grid gap-10">
          <FeaturedItem product={products[1]} locale={locale} />
          <FeaturedItem product={products[2]} locale={locale} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10"></div>
    </div>
  );
};

const FeaturedItem = ({ product, locale }: { product: Product, locale:string }) => {
  return (
    <Link
      href={`/${locale}/products/${product.slug}` as never}
      className="group border border-neutral-800 rounded-md overflow-hidden relative block"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black transition-all duration-200 z-30" />
      <div className="absolute text-sm top-4 right-2 md:top-10 md:right-10 z-40 bg-white rounded-full pr-1 pl-4 py-1 text-black font-medium flex gap-4 items-center">
        <span>{product.name}</span>
        <span className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white px-2 py-1 rounded-full">
          ${formatNumber(product.price)}
        </span>
      </div>
      <Image
        src={strapiImage(product.images[0].url)}
        alt={product.name}
        width={1000}
        height={1000}
        className="h-full w-full object-cover group-hover:scale-105 transition duration-200"
      />
    </Link>
  );
};
