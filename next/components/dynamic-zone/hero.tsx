'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import React, { useMemo, useState, useEffect } from 'react';

import ShootingStars from '../decorations/shooting-star';
import StarBackground from '../decorations/star-background';
import { Button as ElementButton } from '../elements/button';
import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { Image as StrapiImageType } from '@/types/types';

export const Hero = ({
  heading,
  sub_heading,
  CTAs,
  locale,
  background,
  text_change
}: {
  heading: string;
  sub_heading: string;
  CTAs: any[];
  locale: string;
  background: StrapiImageType[];
  text_change: string
}) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  // 1. Extraire les mots entre guillemets ["mot1", "mot2"]
  const wordsArray = useMemo(() => {
    const matches = text_change.match(/"([^"]+)"/g);
    return matches ? matches.map(m => m.replace(/"/g, '')) : [];
  }, [text_change]);

  // 2. Gestion des intervalles
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % background.length);
      if (wordsArray.length > 0) {
        setTextIndex((prev) => (prev + 1) % wordsArray.length);
      }
    }, 2000); // Augmenté à 4s pour plus de fluidité visuelle

    return () => clearInterval(interval);
  }, [background.length, wordsArray.length]);

  return (
    <div className="h-dvh min-h-[600px] overflow-hidden relative flex flex-col bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={background[imageIndex]?.url}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: .2 , ease: 'easeInOut' }}
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('${strapiImage(background[imageIndex]?.url)}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </AnimatePresence>

      {/* Overlay pour la lisibilité */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      <div className="absolute inset-0 z-15">
        <StarBackground />
        <ShootingStars />
      </div>

      <div className="relative z-20 flex flex-col items-start justify-center w-full h-full max-w-7xl px-6 md:px-12 lg:px-24 pt-20 pb-10">
        <Heading
          as="h1"
          size="h1"
          className="max-w-7xl text-start mt-6 relative z-10 py-6 text-white"
        >
          {heading?.split(' ')?.slice(0, -2)?.join(' ')}{' '}

          <div className="inline-block min-w-[200px]">
            <AnimatePresence mode="wait">
              <motion.span
                key={textIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-secondary inline-block"
              >
                {wordsArray[textIndex] || heading?.split(' ')?.slice(-2)?.join(' ')}
              </motion.span>
            </AnimatePresence>
          </div>
        </Heading>

        <Subheading className="text-start mt-2 md:mt-6 text-base md:text-xl text-white max-w-3xl relative z-10">
          {sub_heading}
        </Subheading>

        <div className="flex flex-wrap gap-4 items-center mt-8 w-full">
          {CTAs?.map((cta) => (
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