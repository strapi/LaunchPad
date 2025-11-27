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
  console.log(background);

  return (
    <div className={`h-screen overflow-hidden relative flex flex-col`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <StarBackground />
        <ShootingStars />
      </motion.div>
      <div className='flex flex-col items-start justify-start max-w-5xl px-24'>
        <Heading
          as="h1"
          className="text-4xl md:text-4xl lg:text-8xl font-semibold max-w-7xl mx-auto text-start mt-6 relative z-10 py-6"
        >
          {heading.substring(0, heading.lastIndexOf(' '))}{' '}
          {/* <Cover>{heading.split(' ').pop()}</Cover> */}
          <span className='text-primary'>{heading.split(' ').pop()}</span>
        </Heading>
        <Subheading className="text-start mt-2 md:mt-6 text-base md:text-xl text-muted  max-w-3xl relative z-10">
          {sub_heading}
        </Subheading>
        <div className="flex space-x-2 items-center mt-8">
          {CTAs &&
            CTAs.map((cta) => (
              <ElementButton
                key={cta?.id}
                as={Link}
                href={`/${locale}${cta.URL}`}
                {...(cta.variant && { variant: cta.variant })}
              >
                {cta.text}
              </ElementButton>
            ))}
        </div>
      </div>
    </div>
  );
};
