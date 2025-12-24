import React from 'react'
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { Image } from '@/types/types';
import { BlurImage } from '@/components/blur-image';
import { strapiImage } from '@/lib/strapi/strapiImage';
import type { SectionTitleContentImage } from '@/types/types';
import { Button } from '@/components/elements/button';


export function SectionTitleContentImage({ heading, sub_heading, content, image }: SectionTitleContentImage) {

  return (
    <div className="w-full py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-30">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-start">
        {/* Partie gauche - Contenu */}
        <div className="flex flex-col justify-start gap-3 sm:gap-4">
          {/* Heading */}
          <Typography variant="h2" className="font-bold text-primary text-xl sm:text-2xl md:text-3xl lg:text-4xl">
            {heading}
          </Typography>

          {/* Sub Heading */}
          <Typography variant="h3" className="not-first:mt-2 sm:not-first:mt-3 md:not-first:mt-4 font-medium text-lg sm:text-xl md:text-2xl lg:text-3xl">
            {sub_heading}
          </Typography>
          
          {/* Content */}
          {content && (
            <div className="text-sm sm:text-base md:text-lg font-extralight">
              <BlocksRenderer content={content} />
            </div>
          )}

          {/* Bouton */}
          <div className="pt-2 sm:pt-3 md:pt-4">
            <Button className="w-auto bg-primary text-white border-none text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">
              Parler à un expert
            </Button>
          </div>
        </div>

        {/* Partie droite - Image */}
        {image && (
          <div className="relative h-64 sm:h-80 md:h-96 lg:h-full md:min-h-[400px] lg:min-h-[500px] overflow-hidden">
            <BlurImage
              src={strapiImage(image.url)}
              alt={image.alternativeText || heading}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}
      </div>
    </div>
  )
}