import { ArrowUpRight } from 'lucide-react';
import React from 'react';

import { Button } from '../ui/button';
import { Typography } from '../ui/typography';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { cn } from '@/lib/utils';
import { Image, TeamMember } from '@/types/types';
import { BlurImage } from '../blur-image';


type NotreEquipeHomeProps = {
  heading: string;
  sub_heading: string;
  team_members: TeamMember[];
  locale: string;
};

export function NotreEquipeHome({
  heading,
  sub_heading,
  team_members = [],
  locale,
}: NotreEquipeHomeProps) {

    console.log('Dada', team_members);
  return (
    <section className=" w-full flex flex-col items-center bg-tertiare py-18 px-4 md:px-10 gap-10">
      <Typography
        variant={'h2'}
        className="text-primary text-3xl md:text-5xl font-bold text-center"
      >
        {heading}
      </Typography>

      <Typography
        variant={'p'}
        className="text-black text-center text-base md:text-lg max-w-2xl not-first:mt-2"
      >
        {sub_heading}
      </Typography>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
         {team_members.map((teammember, index) => (
            <CardComponent
              key={teammember.documentId}
              item={teammember}
              locale={locale}
            />
          ))}
      </div>
    </section>
  );
}


function CardComponent({ item, locale }: { item: TeamMember; locale: string }) {
  function OnNavigatePage() {
    window.location.href = item.slug;
  }

  return (
    <div
      className={cn(
        ' h-[380px] sm:h-[400px] md:h-[420px] w-full rounded-xl  bg-center relative overflow-hidden group flex  gap-10'
      )}
    >
      {/* image */}
      <div className="h-full relative w-[40%] ">
        {item?.image?.url && (
          <BlurImage
            src={strapiImage(item.image?.url)}
            alt={item.image?.alternativeText || ''}
            fill
            className="object-cover"
          />
        )}
      </div>
      <div className="h-[80%] w-[40%] flex flex-col gap-6  ">
        {' '}
        {/* <Typography
          variant="h3"
          className={cn(' text-primary text-lg md:text-2xl font-bold')}
        >
          {item.heading}
        </Typography>
        <Typography
          variant="p"
          className={cn(' text-black md:text-sm mb-8')}
        >
          {item.sub_heading}
        </Typography>
        <a href={`/${locale}${item.slug}`}>
          <Button
            onClick={OnNavigatePage}
            className="bg-primary text-white font-semibold  w-fit px-6 py-2 hover:bg-primary"
          >
            Parler à un expert
          </Button>
        </a> */}
      </div>
    </div>
  );
}
