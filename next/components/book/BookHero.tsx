'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { IconArrowRight, IconStar } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { Magnetic } from '@/components/motion/magnetic';
import { Spotlight } from '@/components/motion/spotlight';
import { GlowEffect } from '@/components/motion/glow-effect';
import { Tilt } from '@/components/motion/tilt';
import { FadeIn } from '@/components/cult/fade-in';
import { GradientHeading } from '@/components/cult/gradient-heading';

export function BookHero() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-background via-background-secondary to-background">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <GlowEffect 
          colors={[
            'hsl(160 40% 30% / 0.2)',
            'hsl(270 50% 40% / 0.15)',
            'hsl(10 60% 50% / 0.1)',
          ]}
          mode="breathe"
          blur="strongest"
          duration={8}
        />
      </div>

      <Spotlight size={400} className="from-primary/30 via-primary/10 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          
          {/* Left: Book Cover */}
          <FadeIn delay={0.1} direction="right">
            <Tilt rotationFactor={10} className="relative">
              <div className="relative aspect-[2/3] max-w-md mx-auto lg:mx-0">
                {/* Book Cover */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70 rounded-2xl shadow-2xl shadow-primary/30"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-between p-8 text-white">
                    <div className="flex-1 flex flex-col justify-center text-center">
                      <div className="mb-8">
                        <motion.div 
                          className="w-24 h-24 mx-auto mb-6 bg-white/10 backdrop-blur rounded-full flex items-center justify-center border-2 border-white/30"
                          animate={{ 
                            boxShadow: [
                              '0 0 0 0 rgba(255,255,255,0.2)',
                              '0 0 0 15px rgba(255,255,255,0)',
                            ],
                          }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          <span className="text-3xl font-display font-bold">PS</span>
                        </motion.div>
                        <h3 className="font-serif text-4xl font-bold leading-tight mb-4">
                          GOOD<br />LEADERS<br />DO THIS
                        </h3>
                        <div className="h-px w-24 mx-auto bg-white/50 mb-4" />
                        <p className="text-sm uppercase tracking-widest text-white/80">
                          30 Years of Research
                        </p>
                        <p className="text-lg font-semibold">
                          Distilled into Practice
                        </p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-semibold">Dr. Peter Sung</p>
                      <p className="text-xs uppercase tracking-wider text-white/70 mt-1">
                        Executive Coach & Leadership Expert
                      </p>
                    </div>
                  </div>

                  {/* Shine effect */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-2xl"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
                  />
                </motion.div>
                
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-2xl -z-10" />
              </div>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-4 -right-4 bg-primary text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
              >
                <IconStar className="w-5 h-5 fill-white" />
                <span className="font-semibold text-sm">Coming Q3 2025</span>
              </motion.div>
            </Tilt>
          </FadeIn>

          {/* Right: Content */}
          <div className="space-y-6">
            <FadeIn delay={0.2} direction="left">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-primary/10 border-primary/50 text-primary">
                  New Release 2025
                </Badge>
                <Badge variant="outline" className="bg-secondary/10 border-secondary/50 text-secondary">
                  Leadership
                </Badge>
              </div>
            </FadeIn>

            <FadeIn delay={0.3} direction="left">
              <GradientHeading as="h1" size="xl" className="font-display">
                Good Leaders Do This
              </GradientHeading>
            </FadeIn>
            
            <FadeIn delay={0.35} direction="left">
              <p className="text-2xl text-primary font-medium">
                30 Years of Research, Distilled into Practice
              </p>
            </FadeIn>

            <FadeIn delay={0.4} direction="left">
              <p className="text-xl text-muted-foreground leading-relaxed">
                A groundbreaking framework for transforming leadership through self-awareness, 
                backed by three decades of executive coaching experience and organizational psychology research.
              </p>
            </FadeIn>

            <FadeIn delay={0.45} direction="left">
              <div className="border-l-4 border-primary pl-6 py-4 bg-card/50 rounded-r-lg backdrop-blur">
                <p className="text-muted-foreground italic">
                  "Every leader carries weight. This book teaches you how to carry it 
                  with grace, awareness, and purpose—becoming the secure base your 
                  organization needs."
                </p>
                <p className="text-primary font-semibold mt-2">— Dr. Peter Sung</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.5} direction="left">
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Magnetic intensity={0.3} range={100}>
                  <Link
                    href="/book/coming-soon"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02]"
                  >
                    Get Notified
                    <IconArrowRight className="w-5 h-5" />
                  </Link>
                </Magnetic>
                <Magnetic intensity={0.3} range={100}>
                  <Link
                    href="#preview"
                    className="inline-flex items-center justify-center px-8 py-4 bg-card hover:bg-muted text-foreground font-medium rounded-full border border-border transition-all duration-300"
                  >
                    Preview Contents
                  </Link>
                </Magnetic>
              </div>
            </FadeIn>

            {/* Stats */}
            <FadeIn delay={0.55} direction="left">
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
                {[
                  { value: '280', label: 'Pages' },
                  { value: '12', label: 'Chapters' },
                  { value: '30+', label: 'Years Research' },
                ].map((stat, index) => (
                  <motion.div 
                    key={stat.label}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>

        </div>
      </div>
    </section>
  );
}
