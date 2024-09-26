"use client";
import { motion, useMotionValueEvent } from "framer-motion";
import React, { useRef, useState } from "react";
import { FeatureIconContainer } from "./features/feature-icon-container";
import { Heading } from "../elements/heading";
import { Subheading } from "../elements/subheading";
import { StickyScroll } from "@/components/ui/sticky-scroll";
import {
  IconRocket,
} from "@tabler/icons-react";
import { useScroll } from "framer-motion";


export const Launches = ({ heading, sub_heading, launches }: { heading: string; sub_heading: string; launches: any[] }) => {
  const launchesWithDecoration = launches.map(entry => ({
    ...entry,
    icon: <IconRocket className="h-8 w-8 text-secondary" />,
    content: (
      <p className="text-4xl md:text-7xl font-bold text-neutral-800">
        {entry.mission_number}
      </p>
    ),
  }));

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const backgrounds = ["var(--charcoal)", "var(--zinc-900)", "var(--charcoal)"];

  const [gradient, setGradient] = useState(backgrounds[0]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = launches.map((_, index) => index / launches.length);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setGradient(backgrounds[closestBreakpointIndex % backgrounds.length]);
  });
  return (
    <motion.div
      animate={{
        background: gradient,
      }}
      transition={{
        duration: 0.5,
      }}
      ref={ref}
      className="w-full relative h-full pt-20 md:pt-40"
    >
      <div className="px-6">
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconRocket className="h-6 w-6 text-white" />
        </FeatureIconContainer>
        <Heading className="mt-4">{heading}</Heading>
        <Subheading>
          {sub_heading}
        </Subheading>
      </div>
      <StickyScroll content={launchesWithDecoration} />
    </motion.div>
  );
};
