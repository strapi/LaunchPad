"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageSrc: string;
  technologies?: string[];
  link?: string;
}

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  priority?: boolean;
}

export default function ProjectCard({ project, onClick, priority = false }: ProjectCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      layoutId={`card-${project.id}`}
      className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted cursor-pointer border border-border hover:border-primary/50 transition-colors duration-500 shadow-sm hover:shadow-xl"
      onClick={onClick}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Image Layer */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={project.imageSrc}
          alt={project.title}
          fill
          className={cn(
            "object-cover transition-all duration-700 ease-out group-hover:scale-105",
            imageLoaded ? "blur-0 scale-100" : "blur-xl scale-105"
          )}
          onLoad={() => setImageLoaded(true)}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Gradient Overlay - Always visible but stronger at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
      </div>

      {/* Content Layer */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
        <motion.div
          initial={{ opacity: 0.8, y: 0 }}
          whileHover={{ opacity: 1, y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg font-display tracking-tight">
            {project.title}
          </h3>
          <p className="text-sm font-medium text-white/90 uppercase tracking-wider mb-1 opacity-90">
            {project.subtitle}
          </p>
          
          {/* Hidden description that reveals on hover (optional, keeping it clean for now) */}
          <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-500">
             <p className="text-gray-200 text-sm mt-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
               {project.description}
             </p>
          </div>
        </motion.div>

        {/* Action Indicator */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
