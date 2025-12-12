import Image from 'next/image';
import React from 'react';

import { Typography } from '../ui/typography';
import { strapiImage } from '@/lib/strapi/strapiImage';

export interface SeeRealizationProps {
  header: string;
  sub_header: string;
  description: string;
  image: Image;
}

export interface Image {
  url: string;
}

export function SeeRealization({
  header,
  sub_header,
  description,
  image,
}: SeeRealizationProps) {
  return (
    <section className="w-screen flex justify-center py-12 px-4 sm:px-8 lg:px-12">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="flex flex-col gap-6 max-w-2xl">
          <Typography as="h2" className="text-primary leading-tight">
            {header}
          </Typography>

          <Typography as="h3" className="leading-snug">
            {sub_header}
          </Typography>

          <Typography as="p">{description}</Typography>

          <div className="border-b w-full mt-4" />
        </div>

        <div className="flex justify-center lg:justify-end">
          <Image
            src={strapiImage(image?.url)}
            alt="Réalisation"
            width={700}
            height={900}
            className="rounded-t-xl w-full max-w-xl object-cover"
          />
        </div>
      </div>
    </section>
  );
}
