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
    <div className={`w-full px-30 ${className}`}>
      <figure className="relative w-full">
        <div className="relative w-full overflow-hidden rounded-lg bg-slate-100">
          <StrapiImage
            src={image.url}
            alt={image.alternativeText || 'Section image'}
            width={1200}
            height={600}
            className="w-full h-auto object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          />
        </div>
      </figure>
    </div>
  );
}