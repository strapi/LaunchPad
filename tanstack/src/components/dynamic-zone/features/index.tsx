import { IconRocket } from '@tabler/icons-react';

import { Container } from '../../container';
import { Heading } from '../../elements/heading';
import { Subheading } from '../../elements/subheading';
import { GradientContainer } from '../../gradient-container';
import {
  Card,
  CardDescription,
  CardSkeletonContainer,
  CardTitle,
} from './card';
import { FeatureIconContainer } from './feature-icon-container';
import { SkeletonOne } from './skeletons/first';
import { SkeletonFour } from './skeletons/fourth';
import { SkeletonTwo } from './skeletons/second';
import { SkeletonThree } from './skeletons/third';

/**
 * Maps Strapi span words to full Tailwind class names.
 *
 * We can't use `md:col-span-${n}` string interpolation because Tailwind v4's
 * JIT scanner only sees literal class strings — dynamic names never get
 * generated and every card silently defaults to col-span-1, collapsing the
 * intended bento layout. Listing the classes here ensures the scanner
 * emits all possible variants.
 */
const spanClassMap: Record<string, string> = {
  one: 'md:col-span-1',
  two: 'md:col-span-2',
  three: 'md:col-span-3',
};

function spanClass(span: string | undefined, fallback: string): string {
  if (!span) return fallback;
  return spanClassMap[span.toLowerCase()] || fallback;
}

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
  return (
    <GradientContainer className="md:my-20">
      <Container className="py-20 max-w-7xl mx-auto  relative z-40">
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconRocket className="h-6 w-6 text-white" />
        </FeatureIconContainer>
        <Heading className="pt-4">{heading}</Heading>
        <Subheading className="max-w-3xl mx-auto">{sub_heading}</Subheading>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-10">
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
            <Card className={spanClass(ray_card.span, 'md:col-span-1')}>
              <CardSkeletonContainer className="max-w-[16rem] mx-auto">
                <SkeletonTwo />
              </CardSkeletonContainer>
              <CardTitle>{ray_card.title}</CardTitle>
              <CardDescription>{ray_card.description}</CardDescription>
            </Card>
          )}

          {graph_card && (
            <Card className={spanClass(graph_card.span, 'md:col-span-1')}>
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
            <Card
              className={spanClass(social_media_card.span, 'md:col-span-2')}
            >
              <CardSkeletonContainer showGradient={false}>
                <SkeletonFour />
              </CardSkeletonContainer>
              <CardTitle>{social_media_card.title}</CardTitle>
              <CardDescription>{social_media_card.description}</CardDescription>
            </Card>
          )}
        </div>
      </Container>
    </GradientContainer>
  );
};
