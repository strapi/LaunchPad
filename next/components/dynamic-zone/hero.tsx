'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

import { Cover } from '../decorations/cover';
import ShootingStars from '../decorations/shooting-star';
import StarBackground from '../decorations/star-background';
import { Button as ElementButton } from '../elements/button';
import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { Image } from '@/types/types';
import { strapiImage } from '@/lib/strapi/strapiImage';

export const Hero = ({
  heading,
  sub_heading,
  CTAs,
  locale,
  background
}: {
  heading: string;
  sub_heading: string;
  CTAs: any[];
  locale: string;
  background: Image;
}) => {
  return (
    <div
      className="h-dvh min-h-[600px] overflow-hidden relative flex flex-col bg-cover bg-center"
      style={background ? { backgroundImage: `url('${strapiImage(background?.url)}')` } : undefined}
    >      <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
        <StarBackground />
        <ShootingStars />
      </motion.div>
      <div className='relative z-20 flex flex-col items-start justify-center w-full h-full px-6 md:px-12 lg:px-24 pt-20 pb-10'>
        <Heading
          as="h1"
          className="text-3xl md:text-4xl lg:text-6xl font-semibold max-w-7xl text-start mt-6 relative z-10 py-6 text-white"
        >
          {heading.split(' ').slice(0, -2).join(' ')}{' '}
          <span className='text-secondary'>
            {heading.split(' ').slice(-2).join(' ')}
          </span>
        </Heading>
        <Subheading className="text-start mt-2 md:mt-6 text-base md:text-xl text-white  max-w-3xl relative z-10">
          {sub_heading}
        </Subheading>
        <div className="flex flex-wrap gap-4 items-center mt-8 w-full">
          {CTAs &&
            CTAs.map((cta) => (
              <ElementButton
                key={cta?.id}
                as={Link}
                href={`/${locale}${cta.URL}`}
                {...(cta.variant && { variant: cta.variant })}
                className="py-3 px-6 text-primary w-full sm:w-auto flex justify-center bg-white hover:bg-white border-none"
              >
                {cta.text}
              </ElementButton>
            ))}
        </div>
      </div>
    </div>
  );
};
