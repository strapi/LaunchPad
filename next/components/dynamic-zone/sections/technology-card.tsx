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
      className={cn('w-full overflow-hidden flex flex-col md:flex-row')}
      style={{ backgroundColor: bgColor }}
    >
      {/* Gauche : numéro, heading, technologies */}
      <div className="w-full md:w-3/5 p-6 flex flex-col gap-4" dir="ltr">
        <div>
          <span
            className={cn(' md:text-sm font-extrabold px-3 py-1 inline-block')}
            style={{ backgroundColor: numberBgColor, color: numberTextColor }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <Typography variant="h3" className={cn('text-lg md:text-2xl font-bold mt-8', textColor)}>
            {heading}
          </Typography>
        </div>

        <div>
          {technologies?.length ? (
            <ul className="flex flex-wrap gap-1">
              {technologies.map((tech) => (
                <li key={tech.documentId} className={cn('text-sm', textColor)}>
                  {tech.name}
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant="p" className={textColor}>
              Aucune technologie renseignée
            </Typography>
          )}
        </div>
      </div>

      {/* Droite : image */}
      <div className="w-full md:w-2/5 flex items-center justify-center p-6">
        {image?.url && (
          <BlurImage
            src={strapiImage(image.url)}
            alt={image?.alternativeText || heading}
            width={200}
            height={100}
            className="object-contain"
          />
        )}
      </div>
    </article>
  );
}
