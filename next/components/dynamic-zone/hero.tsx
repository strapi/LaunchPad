'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

import ShootingStars from '../decorations/shooting-star';
import StarBackground from '../decorations/star-background';
import { Button as ElementButton } from '../elements/button';
import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { Image } from '@/types/types';

export const Hero = ({
  heading,
  sub_heading,
  CTAs,
  locale,
  background,
}: {
  heading: string;
  sub_heading: string;
  CTAs: any[];
  locale: string;
  background: Image[];
}) => {
  const [ImageBackground, setImageBackground] = React.useState<Image>(background[0])

  React.useEffect(() => {
    const interval = setInterval(() => {
      setImageBackground(background[Math.floor(Math.random() * background.length)])
    }, 2000)

    return () => clearInterval(interval)
  }, [background])

  return (
    <motion.div
      className="h-dvh min-h-[600px] overflow-hidden inset-0 relative flex flex-col bg-cover bg-center transition-all duration-500"
      key={ImageBackground?.url}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        backgroundImage: `url('${strapiImage(ImageBackground?.url)}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {' '}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <StarBackground />
        <ShootingStars />
      </motion.div>
      <div className="relative z-20 flex flex-col items-start justify-center w-full h-full max-w-7xl px-6 md:px-12 lg:px-24 pt-20 pb-10">
        <Heading
          as="h1"
          size="h1"
          className="max-w-7xl text-start mt-6 relative z-10 py-6 text-white"
        >
          {heading?.split(' ')?.slice(0, -2)?.join(' ')}{' '}
          <span className="text-secondary">
            {heading?.split(' ')?.slice(-2)?.join(' ')}
          </span>
        </Heading>
        <Subheading className="text-start mt-2 md:mt-6 text-base md:text-xl text-white  max-w-3xl relative z-10">
          {sub_heading}
        </Subheading>
        <div className="flex flex-wrap gap-4 items-center mt-8 w-full">
          {CTAs &&
            CTAs?.map((cta) => (
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
    </motion.div>
  );
};
