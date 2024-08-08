"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import Marquee from "react-fast-marquee";
import { AmbientColor } from "../decorations/ambient-color";
import { FeatureIconContainer } from "../features/feature-icon-container";
import { TbLocationBolt } from "react-icons/tb";
import { Heading } from "../elements/heading";
import { Subheading } from "../elements/subheading";
import getTestimonials from "@/constants/page-testimonials";
import { useLocale } from "next-intl";
import { Locale } from "@/config";

export const TestimonialsMarquee = () => {
  const locale = useLocale();
  const testimonials = getTestimonials(locale as Locale);
  return (
    <div className="relative pb-40">
      <div className="pb-20">
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <TbLocationBolt className="h-6 w-6 text-cyan-500" />
        </FeatureIconContainer>
        <Heading className="pt-4">Used by entreprenurs</Heading>
        <Subheading>
          Proactiv is used by serial entrepreneurs and overachievers.
        </Subheading>
      </div>

      <div className="relative">
        <div className="h-full w-10 md:w-80 absolute left-0 inset-y-0 bg-gradient-to-r from-charcoal to-transparent pointer-events-none z-40"></div>
        <div className="h-full w-10 md:w-80 absolute right-0 inset-y-0 bg-gradient-to-l from-charcoal to-transparent pointer-events-none z-40"></div>
        <Marquee pauseOnHover className="h-full">
          {testimonials.map((testimonial, index) => (
            <Card key={`testimonial-${testimonial.src}-${index}`}>
              <Quote>{testimonial.quote}</Quote>
              <div className="flex gap-2 items-center mt-8">
                <Image
                  src={testimonial.src}
                  alt="Manu Arora"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex flex-col">
                  <QuoteDescription className="text-neutral-300">
                    {testimonial.name}
                  </QuoteDescription>
                  <QuoteDescription className="text-neutral-400">
                    {testimonial.designation}
                  </QuoteDescription>
                </div>
              </div>
            </Card>
          ))}
        </Marquee>
        <Marquee
          direction="right"
          className="mt-8 h-full"
          speed={40}
          pauseOnHover
        >
          {testimonials.map((testimonial, index) => (
            <Card key={`testimonial-${testimonial.src}-${index}`}>
              <Quote>{testimonial.quote}</Quote>
              <div className="flex gap-2 items-center mt-8">
                <Image
                  src={testimonial.src}
                  alt="Manu Arora"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex flex-col">
                  <QuoteDescription className="text-neutral-300">
                    {testimonial.name}
                  </QuoteDescription>
                  <QuoteDescription className="text-neutral-400">
                    {testimonial.designation}
                  </QuoteDescription>
                </div>
              </div>
            </Card>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "p-8 rounded-xl h-full max-w-lg mx-2 border border-[rgba(255,255,255,0.10)] bg-[rgba(40,40,40,0.30)] shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group",
        className
      )}
    >
      {children}
    </div>
  );
};

export const Quote = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3 className={cn("text-base font-semibold text-white py-2", className)}>
      {children}
    </h3>
  );
};

export const QuoteDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={cn("text-sm font-normal text-neutral-400 max-w-sm", className)}
    >
      {children}
    </p>
  );
};
