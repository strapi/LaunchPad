"use client";
import React, { useEffect, useRef, useState } from "react";
import { Heading } from "../elements/heading";
import { Subheading } from "../elements/subheading";
import { Container } from "../container";
import { FeatureIconContainer } from "../features/feature-icon-container";
import { IconRocket, IconSettings } from "@tabler/icons-react";
import { Card } from "./card";
import { useScroll, useSpring, useTransform, motion } from "framer-motion";
import { useTranslations } from "next-intl";

export const HowItWorks = () => {
  const t = useTranslations('HowItWorks');
  const cardItems = [
    {
      title: t('step1-title'),
      description: t('step1-description'),
    },
    {
      title: t('step2-title'),
      description: t('step2-description'),
    },
    {
      title: t('step3-title'),
      description: t('step3-description'),
    },
    {
      title: t('step4-title'),
      description: t('step4-description'),
    },
  ];

  return (
    <div>
      <Container className="py-20 max-w-7xl mx-auto  relative z-40">
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconSettings className="h-6 w-6 text-white" />
        </FeatureIconContainer>
        <Heading className="pt-4">{t('title')}</Heading>
        <Subheading className="max-w-3xl mx-auto">
          {t('subtitle')}
        </Subheading>

        {cardItems.map((item, index) => (
          <Card
            title={item.title}
            description={item.description}
            index={index + 1}
            key={"card" + index}
          />
        ))}
      </Container>
    </div>
  );
};
