import Image from 'next/image';
import React from 'react';

import { Button } from '../ui/button';
import { Typography } from '../ui/typography';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { Image as TypeImages } from '@/types/types';

type OffreCardProps = {
  documentId: string;
  image: TypeImages;
  title: string;
  description: string;
};

type ServiceCardProps = {
  heading: string;
  sub_heading: string;
  offres: OffreCardProps[];
};

export function ServiceCard({
  heading,
  sub_heading,
  offres,
}: ServiceCardProps) {
  return (
    <div className="bg-[var(--tertiare)] dark:text-black w-full h-auto px-6 md:px-10 lg:px-14 py-10 flex flex-col gap-8">
      <div className="pt-4 md:pt-8">
        <Typography
          variant="h2"
          className="text-primary font-bold text-start"
        >
          {heading}
        </Typography>

        <Typography
          variant="p"
          className="font-normal text-start max-w-xl md:max-w-2xl lg:max-w-3xl mt-2"
        >
          {sub_heading}
        </Typography>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center w-full">
        {offres?.map((el) => (
          <CardService
            key={el.documentId}
            description={el.description}
            image={el.image}
            title={el.title}
          />
        ))}
      </div>
    </div>
  );
}

function CardService({
  image,
  title,
  description,
}: {
  image: TypeImages;
  title: string;
  description: string;
}) {
  return (
    <div className="w-full max-w-[450px] flex flex-col gap-4 h-auto dark:text-black">
      <Image
        src={strapiImage(image.url)}
        height={500}
        width={500}
        alt={title}
        className="object-contain w-full h-auto rounded-lg"
      />

      <div className="self-start w-full">
        <Typography
          variant="h3"
          className="text-start"
        >
          {title}
        </Typography>

        <Typography
          variant="p"
          className="text-start text-sm md:text-base max-w-md"
        >
          {description}
        </Typography>
      </div>

      <Button className="self-start px-5 py-2 text-sm md:text-base">
        <span className='text-white'>Parler à un expert</span>
      </Button>
    </div>
  );
}
