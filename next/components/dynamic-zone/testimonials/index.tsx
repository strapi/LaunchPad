'use client';

import React from 'react';
import { TbLocationBolt } from 'react-icons/tb';

import { Container } from '../../container';
import { Heading } from '../../elements/heading';
import { Subheading } from '../../elements/subheading';
import { StrapiImage } from '@/components/ui/strapi-image';
import { FeatureIconContainer } from '../features/feature-icon-container';

type Testimonial = {
  id: number;
  text: string;
  user: {
    firstname: string;
    lastname: string;
    job?: string;
    image?: { url: string };
  };
};

export const Testimonials = ({
  heading,
  sub_heading,
  testimonials = [],
}: {
  heading: string;
  sub_heading: string;
  testimonials: Testimonial[];
}) => {
  const featured = testimonials.slice(0, 3);
  const supporting = testimonials.slice(3, 9);

  return (
    <section className="relative py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-aurora-surface opacity-60" aria-hidden />
      <Container>
        <div className="flex flex-col items-start gap-6 text-left">
          <FeatureIconContainer>
            <TbLocationBolt className="h-6 w-6 text-brand-200" />
          </FeatureIconContainer>
          <Heading className="max-w-3xl text-left" size="xl">
            {heading}
          </Heading>
          <Subheading className="max-w-2xl text-left text-base text-text-subtle">
            {sub_heading}
          </Subheading>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {featured.map((testimonial) => (
            <article
              key={testimonial.id}
              className="flex h-full flex-col justify-between rounded-3xl border border-border/60 bg-surface/80 p-8 shadow-card backdrop-blur-sm"
            >
              <blockquote className="text-base font-medium leading-relaxed text-text-primary">
                “{testimonial.text}”
              </blockquote>
              <footer className="mt-8 flex items-center gap-4">
                {testimonial.user?.image?.url ? (
                  <StrapiImage
                    src={testimonial.user.image.url}
                    alt={`${testimonial.user.firstname} ${testimonial.user.lastname}`}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-surfaceMuted text-sm font-semibold text-brand-200">
                    {testimonial.user?.firstname?.[0]}
                    {testimonial.user?.lastname?.[0]}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {testimonial.user.firstname} {testimonial.user.lastname}
                  </p>
                  {testimonial.user.job && (
                    <p className="text-xs text-text-subtle">{testimonial.user.job}</p>
                  )}
                </div>
              </footer>
            </article>
          ))}
        </div>

        {supporting.length > 0 && (
          <div className="mt-12 rounded-4xl border border-border/60 bg-surface/60 p-10 shadow-card backdrop-blur-sm">
            <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-200">
              More voices from the room
            </h3>
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {supporting.map((testimonial) => (
                <article key={testimonial.id} className="rounded-3xl border border-border/40 bg-surfaceMuted/70 p-6">
                  <blockquote className="text-sm leading-relaxed text-text-primary/90">
                    “{testimonial.text}”
                  </blockquote>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-brand-200">
                    {testimonial.user.firstname} {testimonial.user.lastname}
                  </p>
                  {testimonial.user.job && (
                    <p className="mt-1 text-xs text-text-subtle">{testimonial.user.job}</p>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
};
