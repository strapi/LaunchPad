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
    <section className={cn("relative w-full overflow-hidden bg-white dark:bg-charcoal", className)}>
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
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              For Leaders Who Carry the Weight
            </motion.div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white leading-[1.1] mb-6">
              Lead with Clarity. <br />
              <span className="text-cyan-600 dark:text-cyan-400">Anchor in Safety.</span>
            </h1>

            <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed mb-8 max-w-xl">
              Executive coaching that combines organizational psychology with deep spiritual grounding to help you navigate complexity without losing your soul.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/discovery"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-full transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5"
              >
                Start Your Discovery
                <IconArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/framework"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-full transition-all duration-300"
              >
                Explore the Framework
              </Link>
            </div>

            {/* Trust Signals */}
            <div className="flex items-center gap-8 pt-8 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-neutral-900 dark:text-white">30+</span>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Years Experience</span>
              </div>
              <div className="w-px h-12 bg-neutral-200 dark:bg-neutral-800" />
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-neutral-900 dark:text-white">500+</span>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Leaders Coached</span>
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
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:max-w-none rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
              {/* Placeholder for Peter Sung Portrait */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-900">
                 <span className="text-neutral-400 dark:text-neutral-600 font-medium">Peter Sung Portrait</span>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl" />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
