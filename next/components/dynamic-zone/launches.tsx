'use client';

import { IconRocket } from '@tabler/icons-react';
import { motion, useMotionValueEvent } from 'framer-motion';
import { useScroll } from 'framer-motion';
import React, { useRef, useState } from 'react';

import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { FeatureIconContainer } from './features/feature-icon-container';
import { StickyScroll } from '@/components/ui/sticky-scroll';

export const Launches = ({
  heading,
  sub_heading,
  launches,
}: {
  heading: string;
  sub_heading: string;
  launches: any[];
}) => {
  const launchesWithDecoration = launches.map((entry) => ({
    ...entry,
    icon: <IconRocket className="h-8 w-8 text-brand-200" />,
    content: (
      <p className="text-4xl md:text-6xl font-semibold text-text-primary">
        {entry.mission_number}
      </p>
    ),
  }));

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const backgrounds = ['#050d1b', '#0b172b', '#050d1b'];

  const [gradient, setGradient] = useState(backgrounds[0]);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const cardsBreakpoints = launches.map(
      (_, index) => index / launches.length
    );
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
        <FeatureIconContainer>
          <IconRocket className="h-6 w-6 text-brand-200" />
        </FeatureIconContainer>
        <Heading className="mt-4 text-center" size="xl">
          {heading}
        </Heading>
        <Subheading className="mx-auto max-w-3xl text-center text-base text-text-subtle">
          {sub_heading}
        </Subheading>
      </div>
      <StickyScroll content={launchesWithDecoration} />
    </motion.div>
  );
};
