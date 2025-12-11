import React from 'react'
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { Image } from '@/types/types';
import { BlurImage } from '@/components/blur-image';
import { strapiImage } from '@/lib/strapi/strapiImage';
import type { SectionTitleContentImage } from '@/types/types';
import { Button } from '@/components/elements/button';


export function SectionTitleContentImage({ heading, sub_heading,content, image }: SectionTitleContentImage) {

  return (
    <div className="w-full py-12 md:py-20 px-30">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
        {/* Partie gauche - Contenu */}
        <div className="flex flex-col justify-start gap-4">
          {/* Heading */}
          <Typography variant="h2" className="text-3xl md:text-5xl font-bold text-primary">
            {heading}
          </Typography>

          {/* Sub Heading */}
          <Typography variant="p" className="text-xl not-first:mt-4 font-medium">
            {sub_heading}
          </Typography>
          
          {/* Content */}
          {content && (
            <div className="">
              <BlocksRenderer content={content} />
            </div>
          )}

          {/* Bouton */}
          <div className="pt-4">
            <Button className="w-full md:w-auto bg-primary text-white border-none">
              Parler à un expert
            </Button>
          </div>
        </div>

        {/* Partie droite - Image */}
        {image && (
          <div className="relative h-full min-h-[400px] md:min-h-auto overflow-hidden">
            <BlurImage
              src={strapiImage(image.url)}
              alt={image.alternativeText || heading}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}
      </div>
    </div>
  )
}