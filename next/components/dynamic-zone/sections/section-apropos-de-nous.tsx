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
    <div className="w-full py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-30">
      {/* Section principale en colonne */}
      <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 items-center text-center max-w-7xl mx-auto">
        {/* CTA Button avec SVG */}
        {cta && (
          <div>
            <Button 
              className="w-auto bg-[#EBEBEB]  border-none rounded-full text-sm sm:text-base px-5 sm:px-7 py-2.5 sm:py-3 flex items-center gap-2 hover:bg-[#D5D5D5] transition-colors"
              asChild
            >
              <a href={cta.url} target={cta.target || '_self'} className="flex items-center gap-2">
                {/* SVG à l'intérieur du bouton */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-6 sm:h-6">
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
            className="font-bold max-w-4xl"
          >
            {heading}
          </Typography>
        )}

        {/* Sub Heading */}
        {sub_heading && (
          <Typography 
            variant="h4" 
            className="font-extralight max-w-3xl px-4 sm:px-8 md:px-16"
          >
            {sub_heading}
          </Typography>
        )}

        {/* Image */}
        {image && (
          <div className="w-full aspect-[16/9] sm:aspect-[16/8] md:aspect-[1617/386] relative rounded-lg overflow-hidden shadow-md">
            <BlurImage
              src={strapiImage(image.url)}
              alt={image.alternativeText || heading}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 85vw, 1617px"
            />
          </div>
        )}

        {/* Title et Description en flex avec espace considérable */}
        <div className="w-full flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 xl:gap-20 mt-6 md:mt-8 lg:mt-10">
          {/* Title */}
          {title && (
            <div className="md:w-2/5 lg:w-1/3 text-center md:text-left">
              <Typography 
                variant="h2" 
                className="font-bold"
              >
                {title}
              </Typography>
            </div>
          )}

          {/* Description */}
          {description && (
            <div className="text-justify md:w-3/5 lg:w-2/3">
              <div className="text-base sm:text-lg md:text-xl font-extralight leading-relaxed">
                <BlocksRenderer content={description} />
              </div>
            </div>
          )}
        </div>

        {/* Cards en flex */}
        {cards && cards.length > 0 && (
          <div className="w-full flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-10 mt-10 md:mt-12 lg:mt-16">
            {cards.map((card, index) => (
              <div
                key={index}
                className="flex flex-col gap-4 sm:gap-5 md:gap-6 bg-white p-6 sm:p-8 md:px-8 md:pb-8 md:pt-14 lg:px-10 lg:pb-10 lg:pt-16 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 w-full sm:w-[calc(50%-1rem)] md:w-[calc(50%-1.25rem)] lg:w-[calc(50%-1.5rem)] max-w-[600px]"
              >
                {/* Icon */}
                {card.icon && (
                  <div className="bg-tertiare relative w-20 h-20 sm:w-24 sm:h-24 md:w-20 md:h-20 flex items-center justify-center p-4 sm:p-5 md:p-4 rounded-xl">
                    <div className="relative w-full h-full">
                      <BlurImage
                        src={strapiImage(card.icon.url)}
                        alt={card.icon.alternativeText || card.title}
                        fill
                        className="object-contain"
                        sizes="80px"
                      />
                    </div>
                  </div>
                )}

                {/* Card Title */}
                {card.title && (
                  <Typography 
                    variant="h3" 
                    className="font-semibold text-left"
                  >
                    {card.title}
                  </Typography>
                )}

                {/* Card Description */}
                {card.description && (
                  <Typography 
                    variant="base" 
                    className="font-extralight text-justify leading-relaxed"
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