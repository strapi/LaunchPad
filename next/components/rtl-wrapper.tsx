"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { isRTLLocale } from '@/lib/rtl';

interface RTLWrapperProps {
  locale: string;
  children: React.ReactNode;
  className?: string;
}

export function RTLWrapper({ locale, children, className }: RTLWrapperProps) {
  const isRTL = isRTLLocale(locale);
  
  return (
    <div 
      className={cn(className)}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {children}
    </div>
  );
}
