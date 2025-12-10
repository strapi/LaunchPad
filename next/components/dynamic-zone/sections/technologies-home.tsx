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
    <section className="w-full flex flex-col py-16 gap-18 bg-[#EFF6FF]">
      <div className="px-50 flex flex-col gap-6 items-center text-center">
        <Typography variant="h2" className=" text-3xl md:text-4xl font-bold">
          {heading}
        </Typography>
        {sub_heading && (
          <div className="w-full text-black text-base md:text-lg mt-3 max-w-2xl">
            {typeof sub_heading === 'string' ? (
              <Typography variant="p" className="text-black">{sub_heading}</Typography>
            ) : (
              <BlocksRenderer content={sub_heading} />
            )}
          </div>
        )}
      </div>

      <div className="w-full px-50">
        <div className="grid grid-cols-1 gap-10">
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
