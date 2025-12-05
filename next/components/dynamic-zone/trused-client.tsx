import Image from 'next/image';
import React from 'react';

import { Typography } from '../ui/typography';
import { strapiImage } from '@/lib/strapi/strapiImage';

export interface trusedClientProps {
  heading: string;
  sub_heading: string;
  description: string;
  logos: Logo[];
}

export interface Logo {
  id: number;
  company: string;
  image: Image;
}

export interface Image {
  url: string;
}

export function TrusedClient({
  heading,
  description,
  sub_heading,
  logos,
}: trusedClientProps) {
  return (
    <div className="min-h-screen flex flex-col gap-4 px-4 md:px-8 lg:px-16 py-8">
      <Typography as="h2" className="text-primary text-2xl md:text-3xl font-bold">
        {heading}
      </Typography>
      <Typography as="p" className="text-base md:text-lg font-semibold">
        {sub_heading}
      </Typography>
      <Typography as="p" className="text-sm md:text-base font-normal">
        {description}
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center items-center w-full mt-8">
        {logos.map((el) => (
          <div key={el.id} className="flex flex-col gap-2 items-center text-center">
            <Image
              src={`${strapiImage(el.image?.url)}`}
              width={50}
              height={50}
              className="object-contain object-center rounded-full"
              alt={el.company}
            />
            <Typography as="span" className="text-xs md:text-sm">{el.company}</Typography>
          </div>
        ))}
      </div>
    </div>
  );
}
