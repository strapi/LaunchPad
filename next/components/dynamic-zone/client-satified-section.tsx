import Image from 'next/image';
import React from 'react';

import { Typography } from '../ui/typography';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { Image as ImageType } from '@/types/types';

export interface ClientSatisfiedSectionProps {
  heading: string;
  sub_heading: string;
  client_satisfied_detaileds: ClientSatisfiedDetailed[];
  logos: Logo[];
}

export interface ClientSatisfiedDetailed {
  id: number;
  heading: string;
  sub_heading: string;
  description: null | string;
}

export interface Logo {
  id: number;
  company: string;
  image: Image;
}

export interface Image {
  id: number;
  name: string;
  url: string;
}

export function ClientSatisfiedSection({
  heading,
  sub_heading,
  client_satisfied_detaileds,
  logos = [],
}: ClientSatisfiedSectionProps) {
  return (
    <section className="w-full min-h-screen flex flex-col justify-items-center gap-16 p-16 text-foreground">
      <header className="flex flex-col gap-4 text-start">
        <Typography
          as="h2"
          className="text-primary font-bold text-3xl text-start"
        >
          {heading}
        </Typography>
        <Typography as="p" className="text-lg font-semibold text-start">
          {sub_heading}
        </Typography>
      </header>

      <div className="flex flex-wrap justify-center items-center gap-6">
        {logos && logos.map((el) => <LogoImage key={el.id} logo={el.image} />)}
      </div>

      <div className="w-full border-b border-gray-400" />

      <div className="flex justify-center items-center">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 w-full items-center">
          {client_satisfied_detaileds.map((detail) => (
            <ClientSatisfiedDetailItem
              key={detail.id}
              heading={detail.heading}
              subHeading={detail.sub_heading}
              description={detail.description ?? undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface LogoImageProps {
  logo: Image;
}

function LogoImage({ logo }: LogoImageProps) {
  return (
    <Image
      src={`${strapiImage(logo?.url)}`}
      height={60}
      width={60}
      alt={"Logo d'une entreprise"}
      className="object-contain"
    />
  );
}

interface ClientSatisfiedDetailProps {
  heading: string;
  subHeading: string;
  description?: string;
}

function ClientSatisfiedDetailItem({
  heading,
  subHeading,
  description,
}: ClientSatisfiedDetailProps) {
  return (
    <div className="h-38 w-54 bg-gray-300 flex flex-col gap-2 p-4 text-center rounded-lg">
      <span className="text-secondary text-xl font-bold">{heading}</span>
      <span className="text-lg font-semibold">{subHeading}</span>
      {description && (
        <span className="font-normal text-sm">{description}</span>
      )}
    </div>
  );
}
