'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

import { BlurImage } from '../blur-image';
import HoverImage from '../features/HoverImage';
import { Button } from '../ui/button';
import { Typography } from '../ui/typography';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { cn } from '@/lib/utils';
import { TeamMember } from '@/types/types';

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

      <div className="flex gap-2 justify-center w-full max-w-6xl ">
        {team_members.map((teammember, index) => (
          <HoverImage
            initialSize={200}
            hoverSize={350}
            key={index}
            imageUrl={teammember.image?.url || ''}
            alt={teammember.image?.alternativeText || ''}
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

  const [width, setWidth] = useState('200px'); // taille au repos

  function handleEnter() {
    setWidth('680px'); // taille au hover
  }

  function handleLeave() {
    setWidth('200px'); // revenir à l'état initial
  }

  return (
    <div className="h-[380px] sm:h-[400px] md:h-[420px] w-full relative flex gap-10 overflow-hidden">
      <div
        className="relative h-full w-full overflow-hidden flex items-center justify-center"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {item?.image?.url && (
          <Image
            src={strapiImage(item.image?.url)}
            alt={item.image?.alternativeText || ''}
            style={{
              width: width,
              filter: width === '200px' ? 'grayscale(100%)' : 'grayscale(0%)',
              transition: 'all 0.35s ease-out',
            }}
            className="object-cover h-full block"
            loading="lazy"
            width={200}
            height={500}
          />
        )}
      </div>
    </div>
  );
}
