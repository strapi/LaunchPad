"use client";
import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import React, { CSSProperties, useRef, useState } from "react";

export const GradientContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress, scrollY } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const limitedScrollYProgress = useTransform(
    scrollYProgress,
    [0, 0.5],
    [0, 1]
  );

  const [percentage, setPercentage] = useState(0);
  useMotionValueEvent(limitedScrollYProgress, "change", (latest) => {
    const newPercentage = Math.min(
      100,
      Math.max(0, (latest - 0.1) * (100 / 0.9))
    );
    setPercentage(newPercentage);
  });
  return (
    <div
      ref={ref}
      style={
        {
          "--top": "rgba(97, 106, 115, .12)",
          "--bottom": "transparent",
          "--conic-size": "600px",
        } as CSSProperties
      }
      className={cn("relative z-20", className)}
    >
      <motion.div
        className={`w-full h-[var(--conic-size)] mb-[calc(-1*var(--conic-size))] 
        pointer-events-none select-none relative z-0
        after:content-['']
        after:absolute
        after:inset-0
        after:bg-gradient-to-b
        after:from-transparent
        after:to-[var(--charcoal)]
        after:opacity-100
        `}
        style={{
          background: `conic-gradient(from 90deg at ${
            100 - percentage
          }% 0%, var(--top), var(--bottom) 180deg) 0% 0% / 50% 100% no-repeat, conic-gradient(from 270deg at ${percentage}% 0%, var(--bottom) 180deg, var(--top)) 100% 0% / 50% 100% no-repeat`,
          opacity: 0.901567,
        }}
      />
      {children}
    </div>
  );
};
