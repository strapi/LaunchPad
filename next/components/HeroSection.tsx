'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { IconArrowRight } from '@tabler/icons-react';

interface HeroProps {
  className?: string;
}

export function HeroSection({ className }: HeroProps) {
  return (
    <section className={cn("relative w-full overflow-hidden bg-background transition-colors duration-300", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20 min-h-[90vh] py-12 lg:py-0">
          
          {/* Text Content - Left on Desktop, Bottom on Mobile */}
          <motion.div 
            className="flex-1 w-full max-w-2xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              For Leaders Who Carry the Weight
            </motion.div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-6">
              Lead with Clarity. <br />
              <span className="text-primary">Anchor in Safety.</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl">
              Executive coaching that combines organizational psychology with deep spiritual grounding to help you navigate complexity without losing your soul.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/discovery"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-full transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5"
              >
                Start Your Discovery
                <IconArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/framework"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-foreground border border-border hover:bg-muted/50 rounded-full transition-all duration-300"
              >
                Explore the Framework
              </Link>
            </div>

            {/* Trust Signals */}
            <div className="flex items-center gap-8 pt-8 border-t border-border">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-foreground">30+</span>
                <span className="text-sm text-muted-foreground">Years Experience</span>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-foreground">500+</span>
                <span className="text-sm text-muted-foreground">Leaders Coached</span>
              </div>
            </div>
          </motion.div>

          {/* Image Content - Right on Desktop, Top on Mobile */}
          <motion.div 
            className="flex-1 w-full relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:max-w-none rounded-2xl overflow-hidden bg-muted">
              {/* Placeholder for Peter Sung Portrait */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted">
                 <span className="text-muted-foreground font-medium">Peter Sung Portrait</span>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
