import React from 'react';

import {
  Card,
  CardDescription,
  CardSkeletonContainer,
  CardTitle,
} from './card';
import { SkeletonOne } from './skeletons/first';
import { SkeletonFour } from './skeletons/fourth';
import { SkeletonTwo } from './skeletons/second';
import { SkeletonThree } from './skeletons/third';

/**
 * The features card grid, mirroring the Next frontend's
 * `components/dynamic-zone/features/index.tsx`.
 *
 * The card order (skeleton above or below the title) and the span classes are
 * copied from there deliberately — they are what make this section read
 * identically across all four frontends. Astro renders the heading and
 * subheading itself; only the grid is React.
 */

interface FeatureCard {
  title?: string | null;
  description?: string | null;
  span?: string | null;
}

interface Props {
  globe_card?: FeatureCard | null;
  ray_card?: FeatureCard | null;
  graph_card?: FeatureCard | null;
  social_media_card?: FeatureCard | null;
}

// Strapi stores the width as a word; Tailwind needs the classes spelled out.
const SPAN: Record<string, string> = {
  one: 'md:col-span-1',
  two: 'md:col-span-2',
  three: 'md:col-span-3',
};
const spanClass = (span?: string | null, fallback = 'md:col-span-1') =>
  (span && SPAN[span]) || fallback;

export const FeaturesGrid = ({
  globe_card,
  ray_card,
  graph_card,
  social_media_card,
}: Props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 py-10">
      {globe_card && (
        <Card className={spanClass(globe_card.span, 'md:col-span-2')}>
          <CardTitle>{globe_card.title}</CardTitle>
          <CardDescription>{globe_card.description}</CardDescription>
          <CardSkeletonContainer>
            <SkeletonOne />
          </CardSkeletonContainer>
        </Card>
      )}

      {ray_card && (
        <Card className={spanClass(ray_card.span)}>
          <CardSkeletonContainer className="max-w-[16rem] mx-auto">
            <SkeletonTwo />
          </CardSkeletonContainer>
          <CardTitle>{ray_card.title}</CardTitle>
          <CardDescription>{ray_card.description}</CardDescription>
        </Card>
      )}

      {graph_card && (
        <Card className={spanClass(graph_card.span, 'md:col-span-2')}>
          <CardSkeletonContainer
            showGradient={false}
            className="max-w-[16rem] mx-auto"
          >
            <SkeletonThree />
          </CardSkeletonContainer>
          <CardTitle>{graph_card.title}</CardTitle>
          <CardDescription>{graph_card.description}</CardDescription>
        </Card>
      )}

      {social_media_card && (
        <Card className={spanClass(social_media_card.span)}>
          <CardSkeletonContainer showGradient={false}>
            <SkeletonFour />
          </CardSkeletonContainer>
          <CardTitle>{social_media_card.title}</CardTitle>
          <CardDescription>{social_media_card.description}</CardDescription>
        </Card>
      )}
    </div>
  );
};
