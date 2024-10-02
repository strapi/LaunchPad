import React from "react";
import { Container } from "../../container";
import { Heading } from "../../elements/heading";
import { Subheading } from "../../elements/subheading";
import { FeatureIconContainer } from "./feature-icon-container";
import { GradientContainer } from "../../gradient-container";
import {
  Card,
  CardDescription,
  CardSkeletonContainer,
  CardTitle,
} from "./card";
import { IconRocket } from "@tabler/icons-react";
import { SkeletonOne } from "./skeletons/first";
import { SkeletonTwo } from "./skeletons/second";
import { SkeletonThree } from "./skeletons/third";
import { SkeletonFour } from "./skeletons/fourth";

const wordToNumber: { [key: string]: number } = {
  one: 1,
  two: 2,
  three: 3
};

function convertWordToNumber(word: string) {
  return wordToNumber[word.toLowerCase()] || null;
}

export const Features = ({ heading, sub_heading, globe_card, ray_card, graph_card, social_media_card }: { heading: string, sub_heading: string, globe_card: any, ray_card: any, graph_card: any, social_media_card: any }) => {
  return (
    <GradientContainer className="md:my-20">
      <Container className="py-20 max-w-7xl mx-auto  relative z-40">
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconRocket className="h-6 w-6 text-white" />
        </FeatureIconContainer>
        <Heading className="pt-4">{heading}</Heading>
        <Subheading className="max-w-3xl mx-auto">
          {sub_heading}
        </Subheading>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 py-10">
          {globe_card && (
            <Card className={`md:col-span-${convertWordToNumber(globe_card?.span) || '2'}`} >
              <CardTitle>{globe_card.title}</CardTitle>
              <CardDescription>
                {globe_card.description}
              </CardDescription>
              <CardSkeletonContainer>
                <SkeletonOne />
              </CardSkeletonContainer>
            </Card>
          )}

          {ray_card && (
            <Card className={`md:col-span-${convertWordToNumber(ray_card?.span) || '1'}`} >
              <CardSkeletonContainer className="max-w-[16rem] mx-auto">
                <SkeletonTwo />
              </CardSkeletonContainer>
              <CardTitle>{ray_card.title}</CardTitle>
              <CardDescription>
                {ray_card.description}
              </CardDescription>
            </Card>
          )}

          {graph_card && (
            <Card className={`md:col-span-${convertWordToNumber(graph_card?.span) || '2'}`} >
              <CardSkeletonContainer
                showGradient={false}
                className="max-w-[16rem] mx-auto"
              >
                <SkeletonThree />
              </CardSkeletonContainer>
              <CardTitle>{graph_card.title}</CardTitle>
              <CardDescription>
                {graph_card.description}
              </CardDescription>
            </Card>
          )}

          {social_media_card && (
            <Card className={`md:col-span-${convertWordToNumber(social_media_card?.span) || '1'}`} >
              <CardSkeletonContainer showGradient={false}>
                <SkeletonFour />
              </CardSkeletonContainer>
              <CardTitle>{social_media_card.title}</CardTitle>
              <CardDescription>
                {social_media_card.description}
              </CardDescription>
            </Card>
          )}
        </div>
      </Container>
    </GradientContainer >
  );
};
