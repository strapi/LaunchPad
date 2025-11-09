'use client';

import Link from 'next/link';
import React from 'react';

import { Container } from '../container';
import { Button } from '../elements/button';
import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';

export const CTA = ({
  heading,
  sub_heading,
  CTAs,
  locale,
}: {
  heading: string;
  sub_heading: string;
  CTAs: any[];
  locale: string;
}) => {
  return (
    <section className="relative py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-aurora-surface opacity-70" aria-hidden />
      <Container className="relative flex flex-col items-start gap-12 rounded-4xl border border-border/60 bg-surface/70 px-8 py-12 shadow-card backdrop-blur-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <Heading as="h2" size="md" className="text-left">
            {heading}
          </Heading>
          <Subheading className="mt-4 max-w-xl text-left text-base text-text-subtle">
            {sub_heading}
          </Subheading>
        </div>
        <div className="flex flex-wrap gap-3">
          {CTAs?.map((cta, index) => (
            <Button
              as={Link}
              key={`${cta.text}-${index}`}
              href={`/${locale}${cta.URL}`}
              variant={cta.variant}
              className="min-w-[10rem]"
            >
              {cta.text}
            </Button>
          ))}
        </div>
      </Container>
    </section>
  );
};
