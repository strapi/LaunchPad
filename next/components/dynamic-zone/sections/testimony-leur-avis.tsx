import React from 'react';
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/elements/button';
import type { SectionTestimonyLeurAvis } from '@/types/types';

interface TestimonyLeurAvisProps extends SectionTestimonyLeurAvis {
  locale?: string;
}

export function TestimonyLeurAvis({
  cta,
  heading,
  sub_heading,
  stats,
}: TestimonyLeurAvisProps) {
  return (
    <div className="bg-[#F7F7F7] w-full py-12">
      <div className="flex flex-col items-center text-center gap-10">

        {/* CTA */}
        {cta && (
          <Button
            className="bg-[#EBEBEB] border-none rounded-full text-base px-7 py-3 flex items-center gap-2 hover:bg-[#D5D5D5] transition-colors"
            asChild
          >
            <a href={cta.url} target={cta.target || '_self'} className='flex items-center gap-3'>
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="12" fill="#000000" />
                <path
                  d="M7 12l3.5 3.5L17 8.5"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {cta.text}
            </a>
          </Button>
        )}

        {/* Heading */}
        {heading && (
          <Typography variant="h2" className="font-bold max-w-4xl">
            {heading}
          </Typography>
        )}

        {/* Sub heading */}
        {sub_heading && (
          <Typography variant="large" className="font-extralight px-16">
            {sub_heading}
          </Typography>
        )}

        {/* Stats */}
        {stats && stats.length > 0 && (
          <div className="bg-white w-full flex flex-col sm:flex-row sm:flex-wrap justify-center gap-6 mt-8 px-4 sm:px-20 py-3">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center gap-3 bg-[#F7F7F7] rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow w-full sm:w-[calc(50%-1rem)] md:w-[calc(50%-1rem)] lg:w-auto lg:max-w-[250px]"
              >
                {/* Titre / chiffre */}
                <Typography variant="h3" className="font-bold text-[#FD5E37]">
                  {stat.titre}
                </Typography>

                {/* Description */}
                <Typography variant="small" className="font-bold leading-relaxed">
                  {stat.description}
                </Typography>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
