import Image from 'next/image';
import React from 'react';

import { Typography } from '../ui/typography';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { Image as ImageType } from '@/types/types';
import { InfiniteSlider } from '../InfiniteSlider';

export interface ClientSatisfiedSectionProps {
  heading: string;
  sub_heading: string;
  client_satisfied_detaileds: ClientSatisfiedDetailed[];
  logos: Logo[];
  center?: boolean;
  background_color?: string;
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
  background_color,
  center,
}: ClientSatisfiedSectionProps) {
  // console.log(background_color, center);
  
  return (
    <section className={`w-full h-auto mb-2 flex flex-col items-center gap-8 md:gap-12 lg:gap-16 p-4 sm:p-6 md:p-8 lg:p-16 text-foreground ${center ? 'text-center' : 'text-start'}`} style={{ backgroundColor: background_color || 'transparent' }}>
      <header className="w-full max-w-6xl flex flex-col gap-3 md:gap-4">
        <Typography
          as="h2"
          className="text-primary font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
        >
          {heading}
        </Typography>
        <Typography
          as="p"
          className="text-base sm:text-lg md:text-xl font-semibold"
        >
          {sub_heading}
        </Typography>
      </header>

      <InfiniteSlider >
        {logos && logos.map((el) => <LogoImage key={el.id} logo={el.image} />)}
      </InfiniteSlider>

      {client_satisfied_detaileds && (
      <div className="w-full flex justify-center border-t border-gray-300">
        <div className="w-full max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 justify-items-center w-full">
            {client_satisfied_detaileds?.map((detail) => (
              <ClientSatisfiedDetailItem
                key={detail.id}
                heading={detail.heading}
                subHeading={detail.sub_heading}
                description={detail.description ?? undefined}
              />
            ))}
          </div>
        </div>
      </div> )}
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
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-gray-100 dark:bg-gray-800 flex flex-col gap-2 p-4 sm:p-5 md:p-6 text-center rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <span className="text-secondary text-lg sm:text-xl md:text-2xl font-bold">
        {heading}
      </span>

      <span className="text-base sm:text-lg md:text-xl font-semibold">
        {subHeading}
      </span>

      {description && (
        <span className="font-normal text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
          {description}
        </span>
      )}
    </div>
  );
}
