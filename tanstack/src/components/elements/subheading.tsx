import type { MotionProps } from 'framer-motion';
import React from 'react';

import { cn } from '@/lib/utils';

export const Subheading = ({
  className,
  as: Tag = 'h2',
  children,
}: {
  className?: string;
  as?: any;
  children: any;
  props?: React.HTMLAttributes<HTMLHeadingElement>;
} & MotionProps &
  React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <Tag
      className={cn(
        'text-sm md:text-base max-w-4xl text-left my-4 mx-auto text-balance',
        'text-muted text-center font-normal',
        className
      )}
    >
      {children}
    </Tag>
  );
};
