import { IconRocket } from '@tabler/icons-react';
import React from 'react';

import { Container } from '../../container';
import { Heading } from '../../elements/heading';
import { Subheading } from '../../elements/subheading';
import { Card, CardDescription, CardTitle } from './card';
import { FeatureIconContainer } from './feature-icon-container';

export const Features = ({
  heading,
  sub_heading,
  globe_card,
  ray_card,
  graph_card,
  social_media_card,
}: {
  heading: string;
  sub_heading: string;
  globe_card: any;
  ray_card: any;
  graph_card: any;
  social_media_card: any;
}) => {
  const cards = [
    globe_card,
    ray_card,
    graph_card,
    social_media_card,
  ].filter(Boolean);

  return (
    <section className="py-24">
      <Container>
        <div className="flex flex-col items-start gap-6 text-left">
          <FeatureIconContainer>
            <IconRocket className="h-6 w-6 text-brand-200" />
          </FeatureIconContainer>
          <Heading className="max-w-3xl text-left" size="xl">
            {heading}
          </Heading>
          <Subheading className="max-w-2xl text-left text-base text-text-subtle">
            {sub_heading}
          </Subheading>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card, index) => (
            <Card key={`${card?.title}-${index}`}>
              <span className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-200">
                {String(index + 1).padStart(2, '0')}
              </span>
              <CardTitle className="mt-4 text-xl text-text-primary">
                {card.title}
              </CardTitle>
              <CardDescription className="mt-3 text-sm leading-relaxed text-text-subtle">
                {card.description}
              </CardDescription>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};
