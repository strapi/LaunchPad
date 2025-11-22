'use client';

import { IconSettings } from '@tabler/icons-react';
import React from 'react';

import { Container } from '../../container';
import { Heading } from '../../elements/heading';
import { Subheading } from '../../elements/subheading';
import { FeatureIconContainer } from '../features/feature-icon-container';
import { Card } from './card';

export const HowItWorks = ({
  heading,
  sub_heading,
  steps,
}: {
  heading: string;
  sub_heading: string;
  steps: any;
}) => {
  return (
    <section className="py-24">
      <Container>
        <div className="flex flex-col items-start gap-6 text-left">
          <FeatureIconContainer>
            <IconSettings className="h-6 w-6 text-brand-200" />
          </FeatureIconContainer>
          <Heading className="max-w-3xl text-left" size="xl">
            {heading}
          </Heading>
          <Subheading className="max-w-2xl text-left text-base text-text-subtle">
            {sub_heading}
          </Subheading>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {steps?.map(
            (item: { title: string; description: string }, index: number) => (
              <Card
                title={item.title}
                description={item.description}
                index={index + 1}
                key={`how-it-works-${item.title}-${index}`}
              />
            )
          )}
        </div>
      </Container>
    </section>
  );
};
