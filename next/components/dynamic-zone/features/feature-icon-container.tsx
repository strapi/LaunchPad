import React from 'react';

import { cn } from '@/lib/utils';

export const FeatureIconContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'flex h-14 w-14 items-center justify-center rounded-2xl border border-border/70 bg-surface/80 shadow-card backdrop-blur',
        className
      )}
    >
      {children}
    </div>
  );
};
