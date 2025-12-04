"use client";

import React, { useState } from 'react';
import ProjectCard, { Project } from './ProjectCard';
import { DetailModal } from './DetailModal';

const projects: Project[] = [
  {
    id: 'securebase-platform',
    title: 'SecureBase Platform',
    subtitle: 'Leadership Development Ecosystem',
    description: 'A comprehensive digital platform designed to facilitate leadership growth through structured modules, real-time feedback loops, and community engagement. Built with Next.js and Strapi, it offers a seamless experience for executives to track their progress and access exclusive resources.',
    imageSrc: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop',
    technologies: ['Next.js 15', 'React', 'Tailwind CSS', 'Strapi v5', 'PostgreSQL'],
    link: 'https://securebase.com'
  },
  {
    id: 'assessment-tool',
    title: 'Leadership Assessment',
    subtitle: 'Interactive Psychometric Tool',
    description: 'An advanced interactive assessment tool that evaluates leadership styles and psychological safety metrics. Features real-time data visualization, personalized report generation, and actionable insights based on Dr. Sung\'s research.',
    imageSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2340&auto=format&fit=crop',
    technologies: ['React', 'D3.js', 'Framer Motion', 'Node.js'],
    link: '#'
  },
  {
    id: 'coaching-portal',
    title: 'Executive Portal',
    subtitle: 'Client Management Dashboard',
    description: 'A secure, high-performance dashboard for coaching clients to manage sessions, view notes, and track goals. Features calendar integration, secure messaging, and document sharing.',
    imageSrc: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2344&auto=format&fit=crop',
    technologies: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind UI'],
    link: '#'
  }
];

export default function ProjectsGrid() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section className="py-24 bg-background relative overflow-hidden transition-colors duration-300">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <p className="text-primary font-medium mb-4 tracking-wide uppercase text-sm">
            Selected Work
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 font-display">
            Digital Experiences
          </h2>
          <p className="text-muted-foreground text-lg">
            Showcasing the intersection of leadership methodology and digital innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </div>

      <DetailModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
    </section>
  );
}
