"use client";
import React from "react";
import Link from "next/link";

import { Heading } from "../elements/heading";
import { Button } from "../elements/button";
import { BlurImage } from "../blur-image";
import { Image } from "@/types/types";
import { strapiImage } from "@/lib/strapi/strapiImage";
import { Subheading } from "../elements/subheading";

export const Hero = ({ heading, sub_heading, CTAs, image, locale }: { heading: string; sub_heading: string; CTAs: any[], image: Image; locale: string }) => {
  return (
    <div className="h-screen overflow-hidden relative flex flex-col items-center justify-center">
      <Heading
        as="h1"
        className="text-2xl md:text-4xl lg:text-6xl font-semibold max-w-8xl mx-auto text-center mt-12 relative z-10 py-122"
      >
        {heading}
      </Heading>
      <Subheading className="text-center mt-1 md:mt-3 text-xl md:text-2xl text-charcoal max-w-3xl mx-auto relative z-10">
        {sub_heading}
      </Subheading>
      <BlurImage
        src={strapiImage(image?.url)}
        alt={image?.alternativeText}
        width={200}
        height={200}
        className="rounded-3xl w-1/2 h-1/2 max-h-lvh object-cover my-6"
      />
      <div className="flex space-x-2 items-center mt-8">
        {CTAs && CTAs.map((cta) => (
          <Button
            key={cta?.id}
            as={Link}
            href={`/${locale}${cta.URL}`}
            {...(cta.variant && { variant: cta.variant })}
          >
            {cta.text}
          </Button>
        ))}
      </div>
  </div>
  );
};
