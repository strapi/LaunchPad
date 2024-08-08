import React from "react";
import { useTranslations } from "next-intl";
import { Container } from "../container";
import { Heading } from "../elements/heading";
import { Subheading } from "../elements/subheading";
import { FeatureIconContainer } from "./feature-icon-container";
import { FaBolt } from "react-icons/fa";
import { GradientContainer } from "../gradient-container";
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

export const Features = () => {
  const t = useTranslations('Features');
  return (
    <GradientContainer className="md:my-20">
      <Container className="py-20 max-w-7xl mx-auto  relative z-40">
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconRocket className="h-6 w-6 text-white" />
        </FeatureIconContainer>
        <Heading className="pt-4">{t('title')}</Heading>
        <Subheading className="max-w-3xl mx-auto">
          {t('subtitle')}
        </Subheading>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 py-10">
          <Card className="lg:col-span-2">
            <CardTitle>{t('speedy-delivery')}</CardTitle>
            <CardDescription>
              {t('speedy-delivery-description')}
            </CardDescription>
            <CardSkeletonContainer>
              <SkeletonOne />
            </CardSkeletonContainer>
          </Card>
          <Card>
            <CardSkeletonContainer className="max-w-[16rem] mx-auto">
              <SkeletonTwo />
            </CardSkeletonContainer>
            <CardTitle>{t('scalable-payloads')}</CardTitle>
            <CardDescription>
              {t('scalable-payloads-description')}
            </CardDescription>
          </Card>

          <Card>
            <CardSkeletonContainer
              showGradient={false}
              className="max-w-[16rem] mx-auto"
            >
              <SkeletonThree />
            </CardSkeletonContainer>
            <CardTitle>{t('mission-control-dashboard')}</CardTitle>
            <CardDescription>
              {t('mission-control-dashboard-description')}
            </CardDescription>
          </Card>
          <Card className="lg:col-span-2">
            <CardSkeletonContainer showGradient={false}>
              <SkeletonFour />
            </CardSkeletonContainer>
            <CardTitle>{t('interstellar-integration')}</CardTitle>
            <CardDescription>
              {t('interstellar-integration-description')}
            </CardDescription>
          </Card>
        </div>
      </Container>
    </GradientContainer>
  );
};
