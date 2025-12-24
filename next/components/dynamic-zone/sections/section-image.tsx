'use client';

import React from 'react';
import { StrapiImage } from '@/components/ui/strapi-image';

interface SectionImageProps {
  images?: any[];
  className?: string;
  locale?: string;
}

export function SectionImage({ images, className = '' }: SectionImageProps) {
  // Récupère la première image du tableau
  const image = images && images.length > 0 ? images[0] : null;

  if (!image || !image.url) {
    return null;
  }

  return (
    <div className={`w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-30 py-4 sm:py-6 md:py-8 ${className}`}>
      <figure className="relative w-full">
        <div className="relative w-full overflow-hidden rounded-md sm:rounded-lg bg-slate-100 shadow-sm">
          <StrapiImage
            src={image.url}
            alt={image.alternativeText || 'Section image'}
            width={1200}
            height={600}
            className="w-full h-auto object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 95vw, (max-width: 1024px) 90vw, (max-width: 1280px) 85vw, 1200px"
          />
        </div>
      </figure>
    </div>
  );
}