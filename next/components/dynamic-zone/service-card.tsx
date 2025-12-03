import Image from 'next/image';
import React from 'react';

import { Button } from '../ui/button';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { Image as TypeImages } from '@/types/types';
import { Typography } from '../ui/typography';

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
    <div className="bg-[var(--tertiare)] w-screen h-screen px-14 py-10 flex flex-col gap-8 justify-items-center">
      <div className="pt-8">
        <Typography variant="h2" className="text-primary font-bold text-start">
          {heading}
        </Typography>
        <Typography variant="p" className="text-lg font-normal text-black text-start max-w-3xl">
          {sub_heading}
        </Typography>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
        {offres.map((el) => (
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
    <div className="h-[680px] w-[450px] gap-4 flex flex-col">
      <Image
        src={strapiImage(image.url)}
        height={500}
        width={500}
        alt={title}
        className="object-contain"
      />

      <div className="self-start">
        <Typography variant="h3" className="text-black text-start">{title}</Typography>
        <Typography variant="p" className="text-black text-sm text-start">{description}</Typography>
      </div>

      <Button className="bg-primary text-white self-start">
        Parler à un expert
      </Button>
    </div>
  );
}
