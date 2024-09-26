import { cn } from "@/lib/utils";
import { AnimationProps, MotionProps } from "framer-motion";
import React from "react";
import Balancer from "react-wrap-balancer";

export const Heading = ({
  className,
  as: Tag = "h2",
  children,
  size = "md",
  ...props
}: {
  className?: string;
  as?: any;
  children: any;
  size?: "sm" | "md" | "xl" | "2xl";
  props?: React.HTMLAttributes<HTMLHeadingElement | AnimationProps>;
} & MotionProps &
  React.HTMLAttributes<HTMLHeadingElement | AnimationProps>) => {
  const sizeVariants = {
    sm: "text-xl md:text-2xl md:leading-snug",
    md: "text-3xl md:text-4xl md:leading-tight",
    xl: "text-4xl md:text-6xl md:leading-none",
    "2xl": "text-5xl md:text-7xl md:leading-none",
  };
  return (
    <Tag
      className={cn(
        "text-3xl md:text-5xl md:leading-tight max-w-5xl mx-auto text-center tracking-tight",
        "font-medium",
        "bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-white to-white",
        sizeVariants[size],
        className
      )}
      {...props}
    >
      <Balancer>{children}</Balancer>
    </Tag>
  );
};
