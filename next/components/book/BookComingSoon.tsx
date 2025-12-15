'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IconArrowRight, IconBook, IconCalendar, IconMail, IconSparkles } from '@tabler/icons-react';
import { Magnetic } from '@/components/motion/magnetic';
import { Spotlight } from '@/components/motion/spotlight';
import { GlowEffect } from '@/components/motion/glow-effect';
import { FadeIn } from '@/components/cult/fade-in';
import { GradientHeading } from '@/components/cult/gradient-heading';
import { cn } from '@/lib/utils';

export function BookComingSoon() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-background-secondary">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <GlowEffect 
          colors={[
            'hsl(160 40% 30% / 0.3)',
            'hsl(10 60% 50% / 0.2)',
            'hsl(140 20% 60% / 0.2)',
          ]}
          mode="breathe"
          blur="strongest"
          duration={8}
        />
        
        {/* Decorative circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <Spotlight size={400} className="from-primary/30 via-primary/10 to-transparent" />

      <div className="container relative z-10 mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <FadeIn delay={0.1} className="flex justify-center mb-8">
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <IconSparkles className="w-4 h-4" />
              <span>Coming Q3 2025</span>
            </motion.div>
          </FadeIn>

          {/* Main Title */}
          <FadeIn delay={0.2} className="text-center mb-6">
            <GradientHeading 
              as="h1" 
              size="xxl" 
              variant="default"
              className="font-display"
            >
              Good Leaders Do This
            </GradientHeading>
          </FadeIn>

          {/* Subtitle */}
          <FadeIn delay={0.3} className="text-center mb-8">
            <p className="text-xl md:text-2xl text-muted-foreground font-medium">
              30 Years of Leadership Research, Distilled into Practice
            </p>
          </FadeIn>

          {/* Book Preview Card */}
          <FadeIn delay={0.4} className="mb-12">
            <div className="relative mx-auto max-w-lg">
              {/* Book Mock */}
              <motion.div 
                className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/70 shadow-2xl shadow-primary/20"
                initial={{ rotateY: -5, rotateX: 5 }}
                animate={{ 
                  rotateY: [-5, 5, -5],
                  rotateX: [5, -2, 5],
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
              >
                {/* Book Spine Effect */}
                <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black/20 to-transparent" />
                
                {/* Book Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-between p-8 md:p-12 text-white">
                  {/* Top section */}
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
                      <IconBook className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-sm uppercase tracking-[0.3em] text-white/70 mb-2">
                      A New Book by
                    </p>
                    <p className="text-lg font-semibold">Dr. Peter Sung</p>
                  </div>

                  {/* Center - Title */}
                  <div className="text-center flex-1 flex flex-col justify-center">
                    <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-4">
                      GOOD<br />LEADERS<br />DO THIS
                    </h2>
                    <div className="h-px w-24 mx-auto bg-white/50" />
                  </div>

                  {/* Bottom section */}
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-widest text-white/60">
                      Research-Backed Principles for
                    </p>
                    <p className="text-sm font-medium text-white/80">
                      Transformational Leadership
                    </p>
                  </div>
                </div>

                {/* Shine effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 4,
                    ease: 'easeInOut',
                  }}
                />
              </motion.div>

              {/* Glow under book */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-primary/20 rounded-full blur-2xl" />
            </div>
          </FadeIn>

          {/* Description */}
          <FadeIn delay={0.5} className="text-center mb-12">
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Drawing from three decades of executive coaching experience and organizational psychology research, 
              Dr. Peter Sung presents practical, research-backed leadership principles from real-life accounts 
              of transformation and growth.
            </p>
          </FadeIn>

          {/* Key Features */}
          <FadeIn delay={0.6} className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: IconBook,
                  title: '30+ Years Research',
                  description: 'Distilled leadership wisdom from decades of practice',
                },
                {
                  icon: IconSparkles,
                  title: 'Real Stories',
                  description: 'Authentic accounts of transformation',
                },
                {
                  icon: IconCalendar,
                  title: 'Practical Framework',
                  description: 'Actionable principles you can apply today',
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="relative p-6 rounded-2xl bg-card/50 backdrop-blur border border-border hover:border-primary/20 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <feature.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </FadeIn>

          {/* CTA Section */}
          <FadeIn delay={0.7} className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Magnetic intensity={0.3} range={150}>
                <Link
                  href="#notify"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02]"
                >
                  <IconMail className="w-5 h-5" />
                  Get Notified on Release
                </Link>
              </Magnetic>

              <Magnetic intensity={0.3} range={150}>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-card hover:bg-muted text-foreground font-medium rounded-full border border-border transition-all duration-300"
                >
                  Learn About Dr. Sung
                  <IconArrowRight className="w-5 h-5" />
                </Link>
              </Magnetic>
            </div>

            {/* Email Signup */}
            <div id="notify" className="max-w-md mx-auto">
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-full bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full transition-colors"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-muted-foreground mt-3">
                Be the first to know when the book launches. No spam, ever.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
