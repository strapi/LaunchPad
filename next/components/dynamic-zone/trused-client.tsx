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
      <Typography
        as="h2"
        className="text-primary text-2xl md:text-3xl font-bold"
      >
        {heading}
      </Typography>
      <Typography as="p" className="text-base md:text-lg font-semibold">
        {sub_heading}
      </Typography>
      <Typography as="p" className="text-sm md:text-base font-normal">
        {description}
      </Typography>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 md:gap-10 lg:gap-12 w-full mt-12 md:mt-16">
        {logos.map((el) => (
          <div
            key={el.id}
            className="flex flex-col gap-3 items-center justify-center"
          >
            <div className="flex items-center justify-center w-full h-24 md:h-32">
              <Image
                src={`${strapiImage(el.image?.url)}`}
                width={80}
                height={80}
                className="object-contain object-center max-w-full max-h-full"
                alt={el.company}
              />
            </div>
            <Typography
              as="span"
              className="text-sm md:text-base font-medium text-center"
            >
              {el.company}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
}
