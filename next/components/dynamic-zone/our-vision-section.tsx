import Image from 'next/image';
import React from 'react';

import { Typography } from '../ui/typography';
import { strapiImage } from '@/lib/strapi/strapiImage';

export interface OurVisionSectionProps {
  heading: string;
  sub_heading: string;
  background_color: string;
  vision_detailled: VisionDetailled;
}

export interface VisionDetailled {
  heading: string;
  sub_heading: string;
  image: Image;
  projet_client_satified: ProjetClientSatified[];
}

export interface Image {
  alternativeText: null | string;
  url: string;
}

export interface ProjetClientSatified {
  total: string;
  heading: string;
  description: string;
}

export function OurVisionSection({
  heading,
  sub_heading,
  vision_detailled,
  background_color,
}: OurVisionSectionProps) {
  return (
    <section
      className="w-full"
      style={{ backgroundColor: background_color || 'transparent' }}
    >
      <div className="mx-auto px-6 md:px-12 lg:px-24 py-24">
        <Typography as="h2" className="text-primary font-semibold text-xl mb-6">
          {heading}
        </Typography>

        <Typography className="max-w-2xl text-base leading-relaxed mb-12">
          {sub_heading}
        </Typography>

        <div className="w-full h-px bg-black/50 mb-16" />

        {vision_detailled && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="w-full flex flex-col gap-4">
              <Typography as="h3" className="text-primary font-semibold">
                {vision_detailled.heading}
              </Typography>
              <Image
                src={strapiImage(vision_detailled.image.url)}
                alt={
                  vision_detailled.image.alternativeText ||
                  'Image représentant la collaboration'
                }
                width={720}
                height={520}
                className="w-full h-full object-cover rounded"
              />
            </div>

            <div className="flex flex-col gap-10">
              <div className="space-y-6">
                <Typography className="text-gray-700 leading-relaxed">
                  {vision_detailled.sub_heading}
                </Typography>
              </div>

              <div className="flex flex-col gap-3">
                {vision_detailled.projet_client_satified.map((el, index) => (
                  <div
                    key={index}
                    className="flex gap-10 items-start border-b border-black last:border-0"
                  >
                    <div className="min-w-[120px]">
                      <Typography className="text-4xl font-bold leading-none">
                        {el.total}
                      </Typography>
                      <Typography className=" mt-1">{el.heading}</Typography>
                    </div>

                    <Typography className="leading-relaxed">
                      {el.description}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
