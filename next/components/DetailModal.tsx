"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { IconX, IconExternalLink, IconBrandGithub } from '@tabler/icons-react';
import { Project } from './ProjectCard';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export function DetailModal({ isOpen, onClose, project }: DetailModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-charcoal/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            layoutId={`card-${project.id}`}
            className="relative w-full max-w-4xl bg-surface border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white/70 hover:text-white transition-colors border border-white/10"
            >
              <IconX size={20} />
            </button>

            {/* Hero Image Area */}
            <div className="relative h-64 sm:h-80 md:h-96 w-full flex-shrink-0">
              <Image
                src={project.imageSrc}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
              
              <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-display tracking-tight mb-2"
                >
                  {project.title}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg text-brand-200 font-medium"
                >
                  {project.subtitle}
                </motion.p>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Description */}
                <div className="md:col-span-2 space-y-6">
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  
                  {/* Technologies */}
                  {project.technologies && (
                    <div className="flex flex-wrap gap-2 mt-6">
                      {project.technologies.map((tech) => (
                        <span 
                          key={tech} 
                          className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sidebar / Actions */}
                <div className="space-y-6">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-brand-500/25 group"
                    >
                      <span>Visit Live Site</span>
                      <IconExternalLink size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  )}
                  
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Project Details</h4>
                    <ul className="space-y-3 text-sm text-gray-300">
                      <li className="flex justify-between">
                        <span>Role</span>
                        <span className="text-white">Lead Developer</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Year</span>
                        <span className="text-white">2024</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
