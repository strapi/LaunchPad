import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { ArrowUpRight } from 'lucide-react';
import React from 'react';

import { BlurImage } from '../blur-image';
import { Button } from '../ui/button';
import { Typography } from '../ui/typography';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { cn } from '@/lib/utils';
import { Image, Projet } from '@/types/types';

type SectionProjetHomeProps = {
  heading: string;
  sub_heading: any;
  projets: Projet[];
  locale: string;
};

export function SectionProjetHome({
  heading,
  sub_heading,
  projets,
  locale,
}: SectionProjetHomeProps) {
  return (
    <section className="w-full flex flex-col py-12 md:py-18 gap-4">
      {/* Header Section */}
      <div className="px-4 sm:px-8 md:px-12 lg:px-16">
        <Typography variant="h2" className="text-primary">
          {heading}
        </Typography>

        <div className="w-full text-black text-justify text-base md:text-lg not-first:mt-2">
          <BlocksRenderer content={sub_heading} />
        </div>
      </div>

      {/* Projects Container */}
      <div className="w-full flex bg-tertiare p-4 sm:p-8 md:p-12 lg:p-16">
        {/* 
          Conteneur des cartes avec scroll limité
          - Sur mobile : pas de max-height, scroll naturel de la page
          - Sur desktop : max-height avec scroll interne
        */}
        <div
          dir="rtl"
          className="w-full grid gap-4 sm:gap-6 
                     md:max-h-[1200px] md:overflow-y-auto scrollbar-responsive md:pr-4 lg:pr-10"
        >
          {projets.map((projet) => (
            <CardComponent
              key={projet.documentId}
              projet={projet}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CardComponent({ projet, locale }: { projet: Projet; locale: string }) {
  function OnNavigatePage() {
    window.location.href = `/${locale}${projet.slug}`;
  }

  return (
    <div
      className={cn(
        'h-auto min-h-80 sm:h-[380px] md:h-[400px] lg:h-[420px]',
        'w-full rounded-xl bg-center relative overflow-hidden group',
        'flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-10',
        'p-4 sm:p-6'
      )}
      dir="ltr"
    >
      {/* Image Section */}
      <div className="h-48 sm:h-full relative w-full sm:w-[40%] md:w-[45%] rounded-lg overflow-hidden shrink-0">
        {projet?.image?.url && (
          <BlurImage
            src={strapiImage(projet.image?.url)}
            alt={projet.image?.alternativeText || ''}
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col gap-3 sm:gap-4 md:gap-6 justify-center sm:justify-start py-2 sm:py-4">
        <Typography
          variant="h3"
          className={cn('text-primary', 'leading-tight')}
        >
          {projet.heading}
        </Typography>

        <Typography
          variant="base"
          className={cn(
            'text-black',
            'line-clamp-3 sm:line-clamp-4 md:line-clamp-none'
          )}
        >
          {projet.sub_heading}
        </Typography>

        <a href={`/${locale}${projet.slug}`} className="mt-auto">
          <Button
            onClick={OnNavigatePage}
            className={cn(
              'bg-primary text-white font-semibold',
              'w-full sm:w-fit',
              'px-4 sm:px-6 py-2 sm:py-2.5',
              'hover:bg-primary/90 transition-colors',
              'text-sm sm:text-base'
            )}
          >
            Parler à un expert
          </Button>
        </a>
      </div>
    </div>
  );
}
