import Image from 'next/image';
import React from 'react';

import { Typography } from '../ui/typography';
import { strapiImage } from '@/lib/strapi/strapiImage';

export interface CasEtudeProps {
  heading: string;
  sub_heading: string;
  solution_name: string;
  problematique: Challenge;
  challenge: Challenge;
  solution: Challenge;
}

interface Challenge {
  id: number;
  heading: string;
  background_color: string;
  sub_heading: string;
  image: Image | null;
  title_description_items: TitleDescriptionItem[];
}

interface TitleDescriptionItem {
  id: number;
  heading: string;
  sub_heading: string;
  image: Image;
}

interface Image {
  id: number;
  url: string;
}

export function CasEtude({
  heading,
  sub_heading,
  problematique,
  challenge,
  solution,
  solution_name,
}: CasEtudeProps) {
  return (
    <div className="flex flex-col gap-10 text-foreground px-10 md:px-24 py-24 relative overflow-clip">
      <div className="absolute w-1 h-full bg-primary left-4 md:left-18" />
      <div className="absolute w-6 h-6 bg-primary left-2 md:left-15.5 rounded-full" />

      <div className="flex flex-col gap-2 relative pl-4 md:pl-0">
        <Typography as="h2" className="text-4xl text-primary font-bold">
          {heading}
        </Typography>
        <Typography as="p">{sub_heading}</Typography>
      </div>

      {problematique && (
        <div
          className="flex flex-col gap-8 relative p-6 md:p-10 rounded-xl pl-6 md:pl-0"
          style={{
            backgroundColor: problematique.background_color ?? undefined,
          }}
        >
          <div className="absolute w-6 h-6 bg-primary -left-8.5 top-8 xl:top-12 rounded-full" />

          <Typography as="h2" className="text-4xl text-primary">
            {problematique.heading}
          </Typography>

          <div className="flex flex-col md:flex-row gap-8">
            <Image
              src={strapiImage(problematique.image?.url as string)}
              alt={`${heading} image`}
              width={300}
              height={400}
              className="w-full md:w-[300px] object-contain"
            />

            <div className="flex flex-col gap-8">
              <Typography as="p">{problematique.sub_heading}</Typography>

              {problematique.title_description_items.map((el, index) => {
                const count = index + 1;
                const current_index = count < 10 ? `0${count}` : `${count}`;
                return (
                  <div key={el.id} className="flex flex-col gap-2 space-y-3">
                    <div className="border-b border-gray-500 flex items-baseline gap-2 pb-1">
                      <Typography
                        as="span"
                        className="font-semibold text-gray-500"
                      >
                        {current_index}
                      </Typography>
                      <Typography as="h3">{el.heading}</Typography>
                    </div>

                    <Typography as="p">{el.sub_heading}</Typography>

                    {el.image && (
                      <Image
                        src={strapiImage(el.image.url)}
                        alt={`${el.heading} image`}
                        className="w-full h-52 object-cover rounded-lg"
                        width={600}
                        height={300}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {challenge && (
        <div
          className="flex flex-col gap-8 relative p-6 md:p-10 rounded-xl pl-6 md:pl-0"
          style={{
            backgroundColor: problematique.background_color ?? undefined,
          }}
        >
          <div className="absolute w-6 h-6 bg-primary -left-8.5 top-8 xl:top-12 rounded-full" />

          <Typography as="h2" className="text-4xl text-primary">
            {challenge.heading}
          </Typography>

          <div className="flex flex-col-reverse md:flex-row gap-8">
            <div className="flex flex-col gap-8">
              <Typography as="p">{problematique.sub_heading}</Typography>

              {challenge.title_description_items.map((el, index) => {
                const count = index + 1;
                const current_index = count < 10 ? `0${count}` : `${count}`;
                return (
                  <div key={el.id} className="flex flex-col gap-2 space-y-3">
                    <div className="border-b border-gray-500 flex items-baseline gap-2 pb-1">
                      <Typography
                        as="span"
                        className="font-semibold text-gray-500"
                      >
                        {current_index}
                      </Typography>
                      <Typography as="h3">{el.heading}</Typography>
                    </div>

                    <Typography as="p">{el.sub_heading}</Typography>

                    {el.image && (
                      <Image
                        src={strapiImage(el.image?.url)}
                        alt={`${el.heading} image`}
                        className="w-full h-52 object-cover rounded-lg"
                        width={600}
                        height={300}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <Image
              src={strapiImage(challenge.image?.url as string)}
              alt={`${challenge.heading} image`}
              width={300}
              height={400}
              className="w-full md:w-[300px] object-contain"
            />
          </div>
        </div>
      )}

      {solution && (
        <div
          className="flex flex-col gap-8 relative p-6 md:p-10 rounded-xl pl-6 md:pl-0"
          style={{
            backgroundColor: problematique.background_color ?? undefined,
          }}
        >
          <div className="absolute w-6 h-6 bg-primary -left-8.5 top-8 xl:top-12 rounded-full" />

          <Typography as="h2" className="text-4xl text-primary">
            {solution.heading}
          </Typography>

          <Typography as="p">{solution.sub_heading}</Typography>

          <div className="flex flex-col gap-8">
            {solution.title_description_items.map((el, index) => {
              const count = index + 1;
              const current_index = count < 10 ? `0${count}` : `${count}`;
              return (
                <div key={el.id} className="flex flex-col gap-2 space-y-3">
                  <div className="border-b border-gray-500 flex items-baseline gap-2 pb-1">
                    <Typography as="span" className="text-gray-500">
                      {current_index}
                    </Typography>
                    <Typography as="span" className="font-semibold">
                      {el.heading}
                    </Typography>
                  </div>

                  <Typography as="p">{el.sub_heading}</Typography>

                  {el.image && (
                    <Image
                      src={strapiImage(el.image.url)}
                      alt={`${el.heading} image`}
                      className="w-full h-60 object-cover"
                      width={600}
                      height={300}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="absolute -bottom-1">
        {solution_name && (
          <div className="flex relative">
            <div className="absolute w-6 h-6 bg-primary -left-8.5 top-2 rounded-full" />
            <Typography as="h2" className="text-4xl text-primary font-bold">
              {solution_name}
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
}
