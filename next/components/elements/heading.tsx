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
  size?: 'sm' | 'md' | 'xl' | '2xl';
  props?: React.HTMLAttributes<HTMLHeadingElement>;
} & MotionProps &
  React.HTMLAttributes<HTMLHeadingElement>) => {
  const sizeVariants = {
    sm: 'text-xl md:text-2xl md:leading-snug',
    md: 'text-3xl md:text-4xl md:leading-tight',
    xl: 'text-4xl md:text-6xl md:leading-tight',
    '2xl': 'text-5xl md:text-7xl md:leading-tight',
  };
  return (
    <Tag
      className={cn(
        'text-3xl md:text-5xl md:leading-tight text-text-primary tracking-tight text-left',
        'font-semibold',
        sizeVariants[size],
        className
      )}
      {...props}
    >
      <Balancer>{children}</Balancer>
    </Tag>
  );
};
