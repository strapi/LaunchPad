'use client';

import React from 'react';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';

import { Typography } from '@/components/ui/typography';
import { Image, Technologie } from '@/types/types';
import { TechnologyCard } from './technology-card';

interface TechnologyCard {
  heading: string;
  image?: Image;
  technologies: Technologie[];
}

type TechnologiesHomeProps = {
  heading: string;
  sub_heading?: any;
  cards: TechnologyCard[];
  locale?: string;
};

export function TechnologiesHome({ heading, sub_heading, cards }: TechnologiesHomeProps) {
  return (
    <section className="w-full flex flex-col py-8 sm:py-12 md:py-16 lg:py-20 gap-8 sm:gap-12 md:gap-16 lg:gap-18 bg-[#EFF6FF]">
      <div className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-50 flex flex-col gap-4 sm:gap-5 md:gap-6 items-center text-center">
        <Typography variant="h2" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold px-2">
          {heading}
        </Typography>
        {sub_heading && (
          <div className="w-full text-black text-sm sm:text-base md:text-lg mt-2 sm:mt-3 max-w-xl sm:max-w-2xl px-4">
            {typeof sub_heading === 'string' ? (
              <Typography variant="p" className="text-black">{sub_heading}</Typography>
            ) : (
              <BlocksRenderer content={sub_heading} />
            )}
          </div>
        )}
      </div>

      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-50">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:gap-10">
          {cards.map((card, index) => (
            <TechnologyCard
              key={`${card.heading}-${index}`}
              heading={card.heading}
              image={card.image}
              technologies={card.technologies}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}