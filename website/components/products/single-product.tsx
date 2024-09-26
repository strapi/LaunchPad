"use client";
import React, { useState } from "react";
import { Product } from "@/types/types";
import { motion } from "framer-motion";
import Image from "next/image";
import { IconCheck } from "@tabler/icons-react";
import { cn, formatNumber } from "@/lib/utils";
import AddToCartModal from "@/components/products/modal";
import { useCart } from "@/context/cart-context";
import { strapiImage } from "@/lib/strapi/strapiImage";

export const SingleProduct = ({ product }: { product: Product }) => {
  const [activeThumbnail, setActiveThumbnail] = useState(strapiImage(product.images[0].url));
  const { addToCart } = useCart();
  
  return (
    <div className="bg-gradient-to-b from-neutral-900 to-neutral-950  p-4 md:p-10 rounded-md">
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          {/* <AnimatePresence initial={false} mode="popLayout"> */}
          <motion.div
            initial={{ x: 50 }}
            animate={{ x: 0 }}
            exit={{ x: 50 }}
            key={activeThumbnail}
            className="rounded-lg relative overflow-hidden"
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 35,
            }}
          >
            <Image
              src={activeThumbnail}
              alt={product.name}
              width={600}
              height={600}
              // fill
              className="rounded-lg object-cover"
            />
          </motion.div>
          {/* </AnimatePresence> */}
          <div className="flex gap-4 justify-center items-center mt-4">
            {product.images && product.images.map((image, index) => (
              <button
                onClick={() => setActiveThumbnail(strapiImage(image.url))}
                key={"product-image" + index}
                className={cn(
                  "h-20 w-20 rounded-xl",
                  activeThumbnail === image
                    ? "border-2 border-neutral-200"
                    : "border-2 border-transparent"
                )}
                style={{
                  backgroundImage: `url(${strapiImage(image.url)})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              ></button>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">{product.name}</h2>
          <p className=" mb-6 bg-white text-xs px-4 py-1 rounded-full text-black w-fit">
            ${formatNumber(product.price)}
          </p>
          <p className="text-base font-normal mb-4 text-neutral-400">
            {product.description}
          </p>

          <Divider />
          <ul className="list-disc list-inside mb-6">
            {product.perks && product.perks.map((perk, index) => (
              <Step key={index}>{perk.text}</Step>
            ))}
          </ul>
          <h3 className="text-sm font-medium text-neutral-400 mb-2">
            Available for
          </h3>
          <ul className="list-none flex gap-4 flex-wrap">
            {product.plans && product.plans.map((plan, index) => (
              <li
                key={index}
                className=" bg-neutral-800 text-sm text-white px-3 py-1 rounded-full font-medium"
              >
                {plan.name}
              </li>
            ))}
          </ul>

          <h3 className="text-sm font-medium text-neutral-400 mb-2 mt-8">
            Categories
          </h3>
          <ul className="flex gap-4 flex-wrap">
            {product.categories && product.categories?.map((category, idx) => (
              <li
                key={`category-${idx}`}
                className=" bg-neutral-800 text-sm text-white px-3 py-1 rounded-full font-medium"
              >
                {category.name}
              </li>
            ))}
          </ul>
          <AddToCartModal onClick={() => addToCart(product)} />
        </div>
      </div>
    </div>
  );
};

const Divider = () => {
  return (
    <div className="relative">
      <div className="w-full h-px bg-neutral-950" />
      <div className="w-full h-px bg-neutral-800" />
    </div>
  );
};

const Step = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-start justify-start gap-2 my-4">
      <div className="h-4 w-4 rounded-full bg-neutral-700 flex items-center justify-center flex-shrink-0 mt-0.5">
        <IconCheck className="h-3 w-3 [stroke-width:4px] text-neutral-300" />
      </div>
      <div className="font-medium text-white text-sm">{children}</div>
    </div>
  );
};
