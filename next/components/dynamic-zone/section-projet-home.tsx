import { ArrowUpRight } from 'lucide-react';
import React from 'react';

import { Button } from '../ui/button';
import { Typography } from '../ui/typography';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { cn } from '@/lib/utils';
import { Image, Projet } from '@/types/types';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';

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
    <section className=" w-full flex flex-col items-center bg-[var(--tertiare)] py-18 px-4 md:px-10 gap-10">
      <Typography
        variant={'h2'}
        className="text-primary text-3xl md:text-5xl font-bold text-center"
      >
        {heading}
      </Typography>

      <div className="text-black text-center text-base md:text-lg max-w-2xl not-first:mt-2">
        <BlocksRenderer content={sub_heading}/>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl"></div>
    </section>
  );
}

function CardComponent({
  heading,
  sub_heading,
  slug,
  locale,
  bgColor,
  textColor,
}: {
  heading: string;
  sub_heading: string;
  slug: string;
  locale: string;
  bgColor: string;
  textColor: string;
}) {
  function OnNavigatePage() {
    window.location.href = slug;
  }

  return (
    <div
      className={cn(
        ' h-[380px] sm:h-[400px] md:h-[480px] w-full rounded-xl p-6 flex flex-col justify-center items-center bg-cover bg-center relative',
        bgColor // ✔ background OK
      )}
    >
      <ArrowUpRight className="text-primary absolute top-3 right-3" />

      <Typography
        variant="h3"
        className={cn('text-lg md:text-xl font-bold text-center', textColor)}
      >
        {heading}
      </Typography>

      <Typography
        variant="p"
        className={cn('text-sm md:text-base text-center mb-12', textColor)}
      >
        {sub_heading}
      </Typography>

      <a href={`/${locale}${slug}`}>
        <Button
          onClick={OnNavigatePage}
          className="bg-primary text-white font-semibold mt-4 w-fit px-4 py-2 hover:bg-primary"
        >
          Découvrir le SectionProjetHome
        </Button>
      </a>
    </div>
  );
}
