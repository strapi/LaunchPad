"use client";

import React, { MouseEvent as ReactMouseEvent, useRef } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useSpring,
} from "framer-motion";
import { CanvasRevealEffect } from "../../ui/canvas-reveal-effect";
import Beam from "../../beam";

export const Card = ({
  title,
  description,
  index,
}: {
  title: string;
  description: string;
  index: number;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: ReactMouseEvent<HTMLDivElement>) {
    let { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["end end", "start start"],
  });

  const width = useSpring(useTransform(scrollYProgress, [0, 0.2], [0, 300]), {
    stiffness: 500,
    damping: 90,
  });

  useMotionValueEvent(width, "change", (latest) => {
  });
  return (
    <div
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-4 max-w-4xl mx-auto py-20"
    >
      <p className="text-9xl font-bold text-neutral-900 mt-8">{"0" + index}</p>
      <motion.div
        className="h-px w-full hidden md:block bg-gradient-to-r from-neutral-800 to-neutral-600 rounded-full mt-16 relative overflow-hidden"
        style={{ width }}
      >
        <Beam className="top-0" />
      </motion.div>
      <div
        className="group p-8 rounded-md border border-neutral-800 bg-neutral-950  relative z-40 col-span-2"
        onMouseMove={handleMouseMove}
      >
        <motion.div
          className="pointer-events-none absolute z-10 -inset-px rounded-md opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            maskImage: useMotionTemplate`
            radial-gradient(
              350px circle at ${mouseX}px ${mouseY}px,
              var(--neutral-900),
              transparent 80%
            )
          `,
          }}
        >
          <CanvasRevealEffect
            animationSpeed={5}
            containerClassName="bg-transparent absolute inset-0 pointer-events-none"
            colors={[
              [59, 130, 246],
              [139, 92, 246],
            ]}
            dotSize={2}
          />
        </motion.div>

        <p className="text-xl font-bold relative z-20 mt-2">{title}</p>
        <p className="text-neutral-400 mt-4 relative z-20">{description}</p>
      </div>
    </div>
  );
};
