import { IconCheck } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

import AddToCartModal from '@/components/products/modal';
import { StrapiMedia } from '@/components/ui/strapi-media';
import { useCart } from '@/context/cart-context';
import { strapiImage } from '@/lib/strapi/strapi-image';
import { cn, formatNumber } from '@/lib/utils';
import type { Product } from '@/types/types';

export const SingleProduct = ({
  product,
  locale,
  addToCartText,
  buyNowText,
}: {
  product: Product;
  locale: string;
  addToCartText?: string;
  buyNowText?: string;
}) => {
  // Track the index rather than a resolved URL, so the active media keeps its
  // `mime` (video vs image) and its RAW url — StrapiMedia needs the raw url to
  // decode the draft-mode source-map markers before it strips them.
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = product.images[activeIndex];
  const { addToCart } = useCart();

  return (
    <div className="bg-gradient-to-b from-neutral-900 to-neutral-950  p-4 md:p-10 rounded-md">
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <motion.div
            initial={{ x: 50 }}
            animate={{ x: 0 }}
            exit={{ x: 50 }}
            key={activeIndex}
            className="rounded-lg relative overflow-hidden"
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 35,
            }}
          >
            <StrapiMedia
              src={activeImage.url}
              mime={activeImage.mime}
              alt={product.name}
              width={600}
              height={600}
              className="rounded-lg object-cover"
            />
          </motion.div>
          <div className="flex gap-4 justify-center items-center mt-4">
            {product.images &&
              product.images.map((image, index) => (
                <button
                  onClick={() => setActiveIndex(index)}
                  key={'product-image' + index}
                  className={cn(
                    'h-20 w-20 rounded-xl',
                    index === activeIndex
                      ? 'border-2 border-neutral-200'
                      : 'border-2 border-transparent'
                  )}
                  style={{
                    backgroundImage: `url(${strapiImage(image.url)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                ></button>
              ))}
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-semibold mb-4">{product.name}</h1>
          <p className=" mb-6 bg-white text-xs px-4 py-1 rounded-full text-black w-fit">
            {locale === 'fr' ? '€' : '$'}
            {formatNumber(product.price, locale)}
          </p>
          <p className="text-base font-normal mb-4 text-neutral-400">
            {product.description}
          </p>

          <Divider />
          <ul className="list-disc list-inside mb-6">
            {product.perks &&
              product.perks.map((perk: any, index: number) => (
                <Step key={index}>{perk.text}</Step>
              ))}
          </ul>
          {product.plans && product.plans.length > 0 && (
            <>
              <h3 className="text-sm font-medium text-neutral-400 mb-2">
                Available for
              </h3>
              <ul className="list-none flex gap-4 flex-wrap">
                {product.plans.map((plan: any, index: number) => (
                  <li
                    key={index}
                    className=" bg-neutral-800 text-sm text-white px-3 py-1 rounded-full font-medium"
                  >
                    {plan.name}
                  </li>
                ))}
              </ul>
            </>
          )}

          {product.categories && product.categories.length > 0 && (
            <>
              <h3 className="text-sm font-medium text-neutral-400 mb-2 mt-8">
                Categories
              </h3>
              <ul className="flex gap-4 flex-wrap">
                {product.categories.map((category: any, idx: number) => (
                  <li
                    key={`category-${idx}`}
                    className=" bg-neutral-800 text-sm text-white px-3 py-1 rounded-full font-medium"
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            </>
          )}
          <AddToCartModal
            onClick={() => addToCart(product)}
            ctaText={addToCartText}
            buyNowText={buyNowText}
            locale={locale}
          />
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
