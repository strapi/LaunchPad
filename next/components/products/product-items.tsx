import { Product } from "@/data/products";
import React from "react";
import { Heading } from "../elements/heading";
import { Subheading } from "../elements/subheading";
import Image from "next/image";
import { cn, formatNumber, truncate } from "@/lib/utils";
import { Link } from "@/navigation";

export const ProductItems = ({
  title = "Popular",
  products,
}: {
  title?: string;
  products: Product[];
}) => {
  return (
    <div className="py-20">
      <h2 className="text-2xl md:text-4xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-white to-white mb-2">
        {title}
      </h2>
      <p className="text-neutral-500 text-lg mt-4 mb-10">
        Recently rose to popularity
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3  gap-20">
        {products.map((product) => (
          <ProductItem
            key={"regular-product-item" + product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
};

const ProductItem = ({ product }: { product: Product }) => {
  return (
    <Link href={`/products/${product.slug}`} className="group  relative block">
      <div className="relative border border-neutral-800  rounded-md overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black transition-all duration-200 z-30" />

        <Image
          src={product.images[0]}
          alt={product.title}
          width={600}
          height={600}
          className="h-full w-full object-cover group-hover:scale-105 transition duration-200"
        />
      </div>

      <div className="mt-8">
        <div className="flex justify-between">
          <span className="text-white text-base font-medium">
            {product.title}
          </span>
          <span className="bg-white text-black shadow-derek text-xs px-2 py-1 rounded-full">
            ${formatNumber(product.price)}
          </span>
        </div>
        <p className="text-neutral-400 text-sm mt-4">
          {truncate(product.description, 100)}
        </p>
      </div>
    </Link>
  );
};
