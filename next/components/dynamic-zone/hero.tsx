'use client';

import Link from 'next/link';
import React from 'react';

import { Container } from '../container';
import { Button } from '../elements/button';
import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';

const HERO_STATS = [
  { label: 'Coaching & assessment hours', value: '4000+' },
  { label: 'Speaking engagements', value: '2000+' },
  { label: 'Leaders served', value: 'All levels' },
];

const HERO_OFFERS = [
  'Executive coaching that builds agency and self-awareness.',
  'Conversation-led assessments that surface leadership blind spots.',
  'Keynotes and retreats that re-energize teams with practical insight.',
];

export const Hero = ({
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
    <section className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-aurora-surface opacity-80" aria-hidden />
      <Container className="relative flex flex-col gap-16 py-24 lg:flex-row lg:items-center">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-200">
            Leadership coaching & speaking
          </p>
          <Heading as="h1" size="2xl" className="mt-6 text-left text-balance">
            {heading}
          </Heading>
          <Subheading as="p" className="mt-6 text-left text-lg text-text-subtle">
            {sub_heading}
          </Subheading>
          <div className="mt-8 flex flex-wrap gap-3">
            {CTAs?.map((cta) => (
              <Button
                key={cta?.id ?? cta?.text}
                as={Link}
                href={`/${locale}${cta.URL}`}
                {...(cta.variant && { variant: cta.variant })}
              >
                {cta.text}
              </Button>
            ))}
          </div>
          <dl className="mt-12 grid gap-6 sm:grid-cols-3">
            {HERO_STATS.map((item) => (
              <div key={item.label} className="rounded-3xl border border-border/60 bg-surface/70 p-6 shadow-card backdrop-blur">
                <dt className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-200">
                  {item.label}
                </dt>
                <dd className="mt-3 text-2xl font-semibold text-text-primary">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative flex-1">
          <div className="relative mx-auto max-w-md rounded-4xl border border-border/70 bg-surface/80 p-8 shadow-card backdrop-blur">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-200">
              What we work on together
            </h3>
            <ul className="mt-6 space-y-4 text-text-primary/90">
              {HERO_OFFERS.map((offer) => (
                <li key={offer} className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-400" aria-hidden />
                  <span className="text-sm leading-relaxed">{offer}</span>
                </li>
              ))}
            </ul>
          </div>
          <figure className="absolute -right-6 top-8 hidden max-w-xs rounded-3xl border border-border/50 bg-surfaceMuted/80 p-6 text-sm text-text-muted shadow-card backdrop-blur-lg lg:block">
            <blockquote className="italic">
              “I speak to leaders and into their lives. It all starts with self-awareness.”
            </blockquote>
            <figcaption className="mt-4 text-xs uppercase tracking-[0.25em] text-brand-200">
              Dr. Peter Sung
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
};
