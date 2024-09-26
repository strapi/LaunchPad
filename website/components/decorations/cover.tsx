"use client";
import React from "react";
import { motion } from "framer-motion";
export const Cover = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="relative inline-block bg-neutral-900 px-2 py-1">
      <span className="text-white">{children}</span>
      <CircleIcon className="absolute -right-[2px] -top-[2px]" />
      <CircleIcon className="absolute -bottom-[2px] -right-[2px]" delay={0.4} />
      <CircleIcon className="absolute -left-[2px] -top-[2px]" delay={0.8} />
      <CircleIcon className="absolute -bottom-[2px] -left-[2px]" delay={1.6} />
    </div>
  );
};

export const CircleIcon = ({
  className,
  delay,
}: {
  className?: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{
        opacity: 0.2,
      }}
      animate={{
        opacity: [0.2, 0.5, 0.2],
      }}
      transition={{
        duration: 1,
        delay: delay ?? 0,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "linear",
        repeatDelay: delay,
      }}
      className={`pointer-events-none h-2 w-2 rounded-full bg-white opacity-20 ${className}`}
    ></motion.div>
  );
};
