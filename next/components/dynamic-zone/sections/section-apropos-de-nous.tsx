import React from 'react';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { Typography } from '@/components/ui/typography';
import { BlurImage } from '@/components/blur-image';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { Button } from '@/components/elements/button';
import type { SectionAproposDeNous } from '@/types/types';

interface SectionAProposDeNousProps extends SectionAproposDeNous {
  locale?: string;
}

export function SectionAProposDeNous({
  locale, 
  heading, 
  sub_heading, 
  description, 
  title, 
  image, 
  cta, 
  cards 
}: SectionAProposDeNousProps) {
  return (
    <div className="w-full py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-30">
      {/* Section principale en colonne */}
      <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 items-center text-center">
        {/* CTA Button avec SVG */}
        {cta && (
          <div>
            <Button 
              className="w-auto bg-[#EBEBEB] text-white border-none text-small sm:text-base px-4 sm:px-6 py-2 sm:py-3 flex items-center gap-2"
              asChild
            >
              <a href={cta.url} target={cta.target || '_self'} className="flex items-center gap-2">
                {/* SVG à l'intérieur du bouton */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="12" fill="#000000"/>
                  <path d="M7 12l3.5 3.5L17 8.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {cta.text}
              </a>
            </Button>
          </div>
        )}

        {/* Heading */}
        {heading && (
          <Typography 
            variant="h2" 
            className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl"
          >
            {heading}
          </Typography>
        )}

        {/* Sub Heading */}
        {sub_heading && (
          <Typography 
            variant="h4" 
            className="font-extralight sm:text-xl md:text-lg "
          >
            {sub_heading}
          </Typography>
        )}

        {/* Image */}
        {image && (
          <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] w-full overflow-hidden rounded-lg">
            <BlurImage
              src={strapiImage(image.url)}
              alt={image.alternativeText || heading}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            />
          </div>
        )}

        {/* Title et Description en flex avec espace considérable */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 xl:gap-20 mt-4 md:mt-6">
          {/* Title */}
          {title && (
            <div className="md:w-2/5 lg:w-1/3">
              <Typography 
                variant="h2" 
                className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl"
              >
                {title}
              </Typography>
            </div>
          )}

          {/* Description */}
          {description && (
            <div className="md:w-3/5 lg:w-2/3 text-large sm:text-base md:text-lg font-extralight">
              <BlocksRenderer content={description} />
            </div>
          )}
        </div>

        {/* Cards en flex */}
        {cards && cards.length > 0 && (
          <div className="flex flex-wrap gap-6 sm:gap-8 mt-8 md:mt-10 lg:mt-12">
            {cards.map((card, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 sm:gap-4 bg-white p-4 sm:p-5 md:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)] text-justify"
              >
                {/* Icon */}
                {card.icon && (
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
                    <BlurImage
                      src={strapiImage(card.icon.url)}
                      alt={card.icon.alternativeText || card.title}
                      fill
                      className="object-contain"
                      sizes="64px"
                    />
                  </div>
                )}

                {/* Card Title */}
                {card.title && (
                  <Typography 
                    variant="h3" 
                    className="font-semibold text-base sm:text-lg md:text-xl"
                  >
                    {card.title}
                  </Typography>
                )}

                {/* Card Description */}
                {card.description && (
                  <Typography 
                    variant="p" 
                    className="text-sm px-20 sm:text-base text-left font-extralight"
                  >
                    {card.description}
                  </Typography>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}