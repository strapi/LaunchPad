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
  console.log('oli', projets);
  return (
    <section className=" w-full flex flex-col py-18 gap-4 ">
      <div className="px-16">
        <Typography
          variant={'h2'}
          className="text-primary text-3xl md:text-5xl font-bold"
        >
          {heading}
        </Typography>

        <div className="w-full text-black text-justify  text-base md:text-lg not-first:mt-2">
          <BlocksRenderer content={sub_heading} />
        </div>
      </div>

      <div className="w-full flex bg-tertiare p-16">
        {/* Conteneur des cartes avec scroll (scrollbar à gauche) */}
        <div
          dir="rtl"
          className="w-full grid  max-h-[500px] overflow-y-auto scrollbar pl-10 gap-6"
        >
          {/* Conteneur des cartes avec scroll (scrollbar à gauche) */}
          {/*
             Utilisation de `dir="rtl"` : force la direction du conteneur en
             right-to-left, ce qui place la scrollbar verticale à gauche dans la
             plupart des navigateurs.
             Nous remettons chaque carte en `dir="ltr"` pour conserver le sens
             normal du contenu (texte, alignements, boutons).
             Note : `rtl` = "right-to-left" (sens droite → gauche).
           */}
          {projets.map((projet, index) => (
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
    window.location.href = projet.slug;
  }

  return (
    <div
      className={cn(
        ' h-[380px] sm:h-[400px] md:h-[420px] w-full rounded-xl  bg-center relative overflow-hidden group flex  gap-10'
      )}
      dir="ltr"
    >
      {/* image */}
      <div className="h-full relative w-[40%] ">
        {projet?.image?.url && (
          <BlurImage
            src={strapiImage(projet.image?.url)}
            alt={projet.image?.alternativeText || ''}
            fill
            className="object-cover"
          />
        )}
      </div>
      <div className="h-[80%] w-[40%] flex flex-col gap-6  ">
        {' '}
        <Typography
          variant="h3"
          className={cn(' text-primary text-lg md:text-2xl font-bold')}
        >
          {projet.heading}
        </Typography>
        <Typography
          variant="p"
          className={cn(' text-black md:text-sm mb-8')}
        >
          {projet.sub_heading}
        </Typography>
        <a href={`/${locale}${projet.slug}`}>
          <Button
            onClick={OnNavigatePage}
            className="bg-primary text-white font-semibold  w-fit px-6 py-2 hover:bg-primary"
          >
            Parler à un expert
          </Button>
        </a>
      </div>
    </div>
  );
}
