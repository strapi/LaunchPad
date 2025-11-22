import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  imageSrc?: string;
  className?: string;
}

export function HeroSection({ title, subtitle, ctaText = "Get Started", ctaLink = "/contact", imageSrc, className }: HeroProps) {
  return (
    <section className={cn("relative py-20 md:py-32 overflow-hidden", className)}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
            {subtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href={ctaLink} 
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-black bg-cyan-400 hover:bg-cyan-300 rounded-full transition-colors"
            >
              {ctaText}
            </Link>
            <Link 
              href="/about" 
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white border border-white/20 hover:bg-white/10 rounded-full transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
      {/* Background effects could go here */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-b from-cyan-900/20 to-transparent blur-3xl opacity-50" />
    </section>
  );
}
