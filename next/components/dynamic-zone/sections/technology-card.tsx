'use client';

import React from 'react';
import { BlurImage } from '@/components/blur-image';
import { Typography } from '@/components/ui/typography';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { cn } from '@/lib/utils';
import { Image, Technologie } from '@/types/types';

interface TechnologyCardProps {
  heading: string;
  image?: Image;
  technologies: Technologie[];
  index: number;
}

export function TechnologyCard({ heading, image, technologies, index }: TechnologyCardProps) {
  const bgColor = index % 2 === 0 ? '#2E5399' : '#45ABFF';
  const textColor = index % 2 === 0 ? 'text-white' : 'text-black';
  const numberBgColor = index % 2 === 0 ? '#4585FF' : 'white';
  const numberTextColor = index % 2 === 0 ? 'white' : '#0038A1';

  return (
    <article
      key={`${heading}-${index}`}
      className={cn('w-full overflow-hidden flex flex-col md:flex-row shadow-sm')}
      style={{ backgroundColor: bgColor }}
    >
      {/* Gauche : numéro, heading, technologies */}
      <div className="w-full md:w-3/5 p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col gap-3 sm:gap-4" dir="ltr">
        <div>
          <Typography
            variant="small"
            className={cn('font-extrabold px-2 sm:px-3 py-1 inline-block mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm')}
            style={{ backgroundColor: numberBgColor, color: numberTextColor }}
          >
            {String(index + 1).padStart(2, '0')}
          </Typography>
          <Typography variant="h4" className={cn('font-bold mt-2 sm:mt-3 md:mt-4 text-lg sm:text-xl md:text-2xl lg:text-3xl', textColor)}>
            {heading}
          </Typography>
        </div>

        <div>
          {technologies?.length ? (
            <ul className="flex flex-wrap gap-1 sm:gap-2">
              {technologies.map((tech) => (
                <li key={tech.documentId} className={cn('', textColor)}>
                  <Typography variant="base" className="text-xs sm:text-sm md:text-base">{tech.name}</Typography> 
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant="base" className={cn(textColor, 'text-xs sm:text-sm md:text-base')}>
              Aucune technologie renseignée
            </Typography>
          )}
        </div>
      </div>

      {/* Droite : image */}
      <div className="w-full md:w-2/5 flex items-center justify-center p-4 sm:p-5 md:p-6 lg:p-8">
        {image?.url && (
          <BlurImage
            src={strapiImage(image.url)}
            alt={image?.alternativeText || heading}
            width={200}
            height={100}
            className="object-contain w-32 h-16 sm:w-40 sm:h-20 md:w-48 md:h-24 lg:w-56 lg:h-28 xl:w-full xl:h-auto max-w-[200px]"
          />
        )}
      </div>
    </article>
  );
}