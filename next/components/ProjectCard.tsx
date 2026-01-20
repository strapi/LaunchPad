'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Tilt } from '@/components/motion/tilt';
import { GlowEffect } from '@/components/motion/glow-effect';

interface ProjectCardProps {
  title: string;
  description?: string;
  image?: string;
  href: string;
  tags?: string[];
  className?: string;
  index?: number;
}

export function ProjectCard({
  title,
  description,
  image,
  href,
  tags = [],
  className,
  index = 0,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      <Tilt
        rotationFactor={8}
        springOptions={{ stiffness: 300, damping: 20 }}
        className={cn('group', className)}
      >
        <Link href={href} className="block">
          <div className="relative overflow-hidden rounded-2xl bg-card border border-border transition-all duration-500 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
            {/* Glow effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <GlowEffect
                colors={[
                  'hsl(var(--primary) / 0.1)',
                  'hsl(var(--secondary) / 0.1)',
                ]}
                mode="static"
                blur="strong"
              />
            </div>

            {/* Image Container */}
            <div className="relative aspect-[16/10] overflow-hidden">
              {image ? (
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-muted to-secondary/20" />
              )}
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />

              {/* Tags */}
              {tags.length > 0 && (
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-medium bg-background/80 backdrop-blur-sm rounded-full text-foreground border border-border/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="relative p-6">
              <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                {title}
              </h3>
              {description && (
                <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                  {description}
                </p>
              )}

              {/* Arrow indicator */}
              <motion.div 
                className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.1 }}
              >
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </motion.div>
            </div>
          </div>
        </Link>
      </Tilt>
    </motion.div>
  );
}
