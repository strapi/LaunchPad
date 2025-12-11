import { MotionProps } from 'framer-motion';
import React from 'react';
import Balancer from 'react-wrap-balancer';

import { cn } from '@/lib/utils';

export const Heading = ({
  className,
  as: Tag = 'h2',
  children,
  size = 'md',
  ...props
}: {
  className?: string;
  as?: any;
  children: any;
  size?: 'sm' | 'md' | 'xl' | '2xl' | 'h1' | 'h2' | 'h3' | 'h4';
  props?: React.HTMLAttributes<HTMLHeadingElement>;
} & MotionProps &
  React.HTMLAttributes<HTMLHeadingElement>) => {
  const sizeVariants = {
    sm: 'text-xl md:text-2xl md:leading-snug',
    md: 'text-3xl md:text-4xl md:leading-tight',
    xl: 'text-4xl md:text-6xl md:leading-none',
    '2xl': 'text-5xl md:text-7xl md:leading-none',
    h1: "scroll-m-20 font-semibold leading-[100%] tracking-[0%] text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px]",
    h2: "scroll-m-20 font-semibold leading-[100%] tracking-[0%] text-center text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] xl:text-[52px]",
    h3: "scroll-m-20 font-semibold tracking-[0%] text-[24px] leading-[24px] sm:text-[28px] sm:leading-[28px] md:text-[32px] md:leading-[32px] lg:text-[36px] lg:leading-[36px] xl:text-[40px] xl:leading-[40px]",
    h4: "scroll-m-20 font-medium tracking-[0px] align-middle text-[20px] leading-[20px] sm:text-[22px] sm:leading-[22px] md:text-[26px] md:leading-[26px] lg:text-[28px] lg:leading-[28px] xl:text-[32px] xl:leading-[32px]",

  };
  return (
    <Tag
      className={cn(
        'text-3xl md:text-5xl md:leading-tight max-w-5xl text-start tracking-tight text-primary',
        'font-medium',
        sizeVariants[size],
        className
      )}
      {...props}
    >
      <Balancer>{children}</Balancer>
    </Tag>
  );
};
