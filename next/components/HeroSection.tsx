'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { IconArrowRight } from '@tabler/icons-react';
import { Magnetic } from '@/components/motion/magnetic';
import { Spotlight } from '@/components/motion/spotlight';
import { GlowEffect } from '@/components/motion/glow-effect';
import { InView } from '@/components/motion/in-view';
import { FadeIn } from '@/components/cult/fade-in';
import { GradientHeading } from '@/components/cult/gradient-heading';

interface HeroProps {
  className?: string;
}

export function HeroSection({ className }: HeroProps) {
  return (
    <section className={cn("relative w-full overflow-hidden bg-background transition-colors duration-300", className)}>
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <GlowEffect 
          colors={[
            'hsl(160 40% 30% / 0.15)',
            'hsl(10 60% 50% / 0.1)',
            'hsl(140 20% 60% / 0.1)',
          ]}
          mode="breathe"
          blur="strongest"
          duration={10}
        />
      </div>

      <Spotlight size={500} className="from-primary/20 via-primary/5 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20 min-h-[90vh] py-12 lg:py-0">
          
          {/* Text Content - Left on Desktop, Bottom on Mobile */}
          <div className="flex-1 w-full max-w-2xl">
            <FadeIn delay={0.1} direction="up">
              <motion.div 
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ repeat: Infinity, duration: 4 }}
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                For Leaders Who Carry the Weight
              </motion.div>
            </FadeIn>

            <FadeIn delay={0.2} direction="up">
              <GradientHeading as="h1" size="xl" className="font-display mb-6">
                Lead with Clarity.
              </GradientHeading>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
                <span className="text-primary">Anchor in Safety.</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.3} direction="up">
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl">
                Executive coaching that combines organizational psychology with deep spiritual grounding to help you navigate complexity without losing your soul.
              </p>
            </FadeIn>

            <FadeIn delay={0.4} direction="up">
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Magnetic intensity={0.4} range={120}>
                  <Link
                    href="/discovery"
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-full transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5"
                  >
                    Start Your Discovery
                    <IconArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Magnetic>
                <Magnetic intensity={0.4} range={120}>
                  <Link
                    href="/framework"
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-foreground border border-border hover:bg-muted/50 rounded-full transition-all duration-300"
                  >
                    Explore the Framework
                  </Link>
                </Magnetic>
              </div>
            </FadeIn>

            {/* Trust Signals */}
            <FadeIn delay={0.5} direction="up">
              <div className="flex items-center gap-8 pt-8 border-t border-border">
                <motion.div 
                  className="flex flex-col"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <span className="text-3xl font-bold text-foreground">30+</span>
                  <span className="text-sm text-muted-foreground">Years Experience</span>
                </motion.div>
                <div className="w-px h-12 bg-border" />
                <motion.div 
                  className="flex flex-col"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <span className="text-3xl font-bold text-foreground">500+</span>
                  <span className="text-sm text-muted-foreground">Leaders Coached</span>
                </motion.div>
              </div>
            </FadeIn>
          </div>

          {/* Image Content - Right on Desktop, Top on Mobile */}
          <motion.div 
            className="flex-1 w-full relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:max-w-none rounded-2xl overflow-hidden bg-muted">
              {/* Portrait Image Placeholder with gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-muted to-secondary/20 flex items-center justify-center">
                <div className="text-center">
                  <motion.div 
                    className="w-32 h-32 mx-auto mb-4 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center"
                    animate={{ 
                      boxShadow: [
                        '0 0 0 0 hsl(var(--primary) / 0.2)',
                        '0 0 0 20px hsl(var(--primary) / 0)',
                      ],
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <span className="text-4xl font-display font-bold text-primary">PS</span>
                  </motion.div>
                  <span className="text-muted-foreground font-medium">Dr. Peter Sung</span>
                </div>
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
