import { LinkProps } from 'next/link';
import React from 'react';

import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'simple' | 'outline' | 'primary' | 'muted';
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
  href?: LinkProps['href'];
  onClick?: () => void;
  [key: string]: any;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  as: Tag = 'button',
  className,
  children,
  ...props
}) => {
  const baseClass =
    'inline-flex items-center justify-center gap-2 rounded-full border text-sm md:text-sm font-semibold tracking-tight px-5 py-3 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal disabled:cursor-not-allowed disabled:opacity-60';

  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary:
      'bg-brand-500 text-white border-brand-500 shadow-brand hover:bg-brand-400 focus-visible:ring-brand-300',
    outline:
      'border-brand-300 text-brand-100 hover:bg-brand-500/10 focus-visible:ring-brand-300',
    muted:
      'bg-surfaceMuted/70 border-surface text-text-primary hover:bg-surface hover:border-brand-500/30 focus-visible:ring-brand-200',
    simple:
      'border-transparent bg-transparent text-text-primary hover:text-brand-100 focus-visible:ring-brand-200',
  };

  const Element = Tag as any;

  return (
    <Element
      className={cn(baseClass, variants[variant], className)}
      {...props}
    >
      {children ?? `Get Started`}
    </Element>
  );
};
