"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { TestimonialsSlider } from "./slider";
import { FeatureIconContainer } from "../features/feature-icon-container";
import { Heading } from "../elements/heading";
import { Subheading } from "../elements/subheading";
import { TbLocationBolt } from "react-icons/tb";
import Image from "next/image";
import { TestimonialsMarquee } from "./testimonials-marquee";
import { AmbientColor } from "../decorations/ambient-color";

export const Testimonials = () => {
  const t = useTranslations('Testimonials');
  return (
    <div className="relative">
      <AmbientColor />
      <div className="pb-20">
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <TbLocationBolt className="h-6 w-6 text-white" />
        </FeatureIconContainer>
        <Heading className="pt-4">{t('title')}</Heading>
        <Subheading>
          {t('subtitle')}
        </Subheading>
      </div>

      <div className="relative md:py-20 pb-20">
        <TestimonialsSlider />
        <div className="h-full w-full mt-20 bg-charcoal ">
          <TestimonialsMarquee />
        </div>
      </div>
      <div className="absolute bottom-0 inset-x-0 h-40 w-full bg-gradient-to-t from-charcoal to-transparent"></div>
    </div>
  );
};
