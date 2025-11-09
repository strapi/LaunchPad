import React from 'react';

import { cn } from '@/lib/utils';

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        'flex h-full flex-col rounded-3xl border border-border/60 bg-surface/80 p-6 shadow-card backdrop-blur-sm transition hover:border-brand-500/40 hover:shadow-brand',
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3 className={cn('text-lg font-semibold text-text-primary', className)}>
      {children}
    </h3>
  );
};

export const CardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p className={cn('text-sm font-normal text-text-subtle', className)}>
      {children}
    </p>
  );
};
