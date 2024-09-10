"use client";
import React from "react";

import { ProductItems } from "@/components/products/product-items";

export const RelatedProducts = ({ heading, sub_heading, products }: { heading: string; sub_heading: string; products: any[] }) => {
  return (
    <div className="mt-10">
      <ProductItems heading={heading} sub_heading={sub_heading} products={products} />
    </div>
  );
};
