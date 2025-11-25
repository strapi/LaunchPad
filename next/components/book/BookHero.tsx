'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { IconArrowRight, IconStar } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';

export function BookHero() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-charcoal via-zinc-900 to-charcoal">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          
          {/* Left: Book Cover */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-[2/3] max-w-md mx-auto lg:mx-0">
              {/* AI Generated Book Cover Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-cyan-700 to-blue-900 rounded-2xl shadow-2xl">
                <div className="absolute inset-0 flex flex-col items-center justify-between p-8 text-white">
                  <div className="flex-1 flex flex-col justify-center text-center">
                    <div className="mb-8">
                      <div className="w-24 h-24 mx-auto mb-6 bg-white/10 backdrop-blur rounded-full flex items-center justify-center border-2 border-white/30">
                        <div className="w-16 h-16 bg-white/20 rounded-full" />
                      </div>
                      <h3 className="font-serif text-4xl font-bold leading-tight mb-4">
                        THE<br />SECURE<br />BASE
                      </h3>
                      <div className="h-px w-24 mx-auto bg-white/50 mb-4" />
                      <p className="text-sm uppercase tracking-widest text-white/80">
                        Leading from
                      </p>
                      <p className="text-lg font-semibold">
                        Awareness, Agency, and Action
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
              </div>
              
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-3xl blur-2xl -z-10" />
            </div>

            {/* Floating Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-4 -right-4 bg-cyan-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
            >
              <IconStar className="w-5 h-5 fill-white" />
              <span className="font-semibold text-sm">Limited Signed Copies</span>
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-cyan-500/10 border-cyan-500/50 text-cyan-400">
                New Release Q2 2026
              </Badge>
              <Badge variant="outline" className="bg-purple-500/10 border-purple-500/50 text-purple-400">
                Leadership
              </Badge>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl font-bold text-white leading-tight">
              The Secure Base
            </h1>
            
            <p className="text-2xl text-cyan-400 font-medium">
              Leading from Awareness, Agency, and Action
            </p>

            <p className="text-xl text-gray-300 leading-relaxed">
              A groundbreaking framework for transforming leadership through self-awareness, 
              backed by 30+ years of executive coaching experience and organizational psychology research.
            </p>

            <div className="border-l-4 border-cyan-500 pl-6 py-4 bg-white/5 rounded-r-lg">
              <p className="text-gray-300 italic">
                "Every leader needs a secure base—a foundation from which to explore, 
                take risks, and grow. This book is your guide to becoming that foundation 
                for yourself and your organization."
              </p>
              <p className="text-cyan-400 font-semibold mt-2">— Dr. Peter Sung</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="#preorder"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-full transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02]"
              >
                Preorder Now
                <IconArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#preview"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-full border border-white/20 transition-all duration-300"
              >
                Preview Contents
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
              <div>
                <div className="text-3xl font-bold text-cyan-400">280</div>
                <div className="text-sm text-gray-400">Pages</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cyan-400">12</div>
                <div className="text-sm text-gray-400">Chapters</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cyan-400">500</div>
                <div className="text-sm text-gray-400">Signed Copies</div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
