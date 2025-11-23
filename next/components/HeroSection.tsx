'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { IconArrowDown, IconChevronDown } from '@tabler/icons-react';

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  className?: string;
  showScrollIndicator?: boolean;
}

// Stagger animation variants per design system
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    },
  },
};

const orbVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: "easeOut" },
  },
};

export function HeroSection({
  title,
  subtitle,
  ctaText = "Get Started",
  ctaLink = "/contact",
  secondaryCtaText = "Learn More",
  secondaryCtaLink = "/about",
  className,
  showScrollIndicator = true,
}: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // Parallax transforms
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <section
      ref={ref}
      className={cn(
        "relative min-h-screen flex items-center justify-center overflow-hidden",
        className
      )}
    >
      {/* Animated background with parallax */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{ scale }}
      >
        {/* Main gradient - light/dark mode */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 via-neutral-100 to-neutral-200 dark:from-charcoal dark:via-charcoal dark:to-zinc-900 transition-colors duration-500" />

        {/* Animated orbs with entrance animation */}
        <motion.div
          variants={orbVariants}
          initial="hidden"
          animate="visible"
          className="absolute top-1/4 right-1/4 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] rounded-full"
        >
          <motion.div
            className="w-full h-full rounded-full bg-cyan-400/20 dark:bg-cyan-500/10 blur-[60px] sm:blur-[80px] md:blur-[120px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        <motion.div
          variants={orbVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="absolute bottom-1/4 left-1/4 w-[200px] sm:w-[300px] md:w-[400px] h-[200px] sm:h-[300px] md:h-[400px] rounded-full"
        >
          <motion.div
            className="w-full h-full rounded-full bg-blue-400/15 dark:bg-blue-500/10 blur-[40px] sm:blur-[60px] md:blur-[100px]"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Third orb for depth */}
        <motion.div
          variants={orbVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] md:w-[800px] h-[400px] sm:h-[600px] md:h-[800px] rounded-full"
        >
          <motion.div
            className="w-full h-full rounded-full bg-purple-400/5 dark:bg-purple-500/5 blur-[80px] sm:blur-[100px] md:blur-[150px]"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Grid pattern overlay */}
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
              backgroundSize: '64px 64px',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Content with parallax and stagger */}
      <motion.div
        className="container mx-auto px-4 sm:px-6 relative z-10"
        style={{ y, opacity }}
      >
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Animated badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-cyan-500/10 dark:bg-cyan-500/10 border border-cyan-500/30 dark:border-cyan-500/20 mb-6 sm:mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500 dark:bg-cyan-400"></span>
            </span>
            <span className="text-cyan-600 dark:text-cyan-400 text-xs sm:text-sm font-medium">High Performance Leadership Coaching</span>
          </motion.div>

          {/* Title with staggered animation */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4 sm:mb-6 leading-[1.05]"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-600 dark:text-gray-300 mb-8 sm:mb-12 leading-relaxed max-w-2xl mx-auto px-4"
          >
            {subtitle}
          </motion.p>

          {/* CTA Buttons - mobile optimized with larger touch targets */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
          >
            <Link
              href={ctaLink}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 sm:py-4 text-base sm:text-lg font-semibold text-white dark:text-black bg-cyan-600 dark:bg-cyan-400 hover:bg-cyan-500 dark:hover:bg-cyan-300 rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] active:scale-95 touch-manipulation"
            >
              {ctaText}
              <motion.svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
            </Link>
            <Link
              href={secondaryCtaLink}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 sm:py-4 text-base sm:text-lg font-medium text-neutral-700 dark:text-white border-2 border-neutral-300 dark:border-white/20 hover:bg-neutral-100 dark:hover:bg-white/10 hover:border-neutral-400 dark:hover:border-white/30 rounded-full transition-all duration-300 active:scale-95 touch-manipulation"
            >
              {secondaryCtaText}
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Enhanced scroll indicator */}
      {showScrollIndicator && (
        <motion.div
          className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <motion.button
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            className="flex flex-col items-center gap-2 text-neutral-400 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xs uppercase tracking-[0.2em] font-medium opacity-60 group-hover:opacity-100 transition-opacity">
              Scroll to explore
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="p-2 rounded-full border border-current/30 group-hover:border-current/50 transition-colors"
            >
              <IconChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </motion.div>
      )}
    </section>
  );
}
