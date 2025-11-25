'use client';

import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

const chapters = [
  {
    number: 1,
    title: 'Why Every Leader Needs a Secure Base',
    description: 'Understanding the foundation of transformative leadership and the science behind secure base theory.',
    pages: '1-24',
  },
  {
    number: 2,
    title: 'The Cost of Unawareness',
    description: 'How blind spots sabotage leadership effectiveness and organizational health.',
    pages: '25-48',
  },
  {
    number: 3,
    title: 'Seeing What's Really There: The Practice of Awareness',
    description: 'Tools and frameworks for developing deep self-awareness and emotional intelligence.',
    pages: '49-78',
  },
  {
    number: 4,
    title: 'The Intention-Impact Gap',
    description: 'Bridging the divide between what you intend and how you're actually perceived.',
    pages: '79-104',
  },
  {
    number: 5,
    title: 'Reclaiming Your Agency',
    description: 'Moving from victim to victor: taking ownership of your leadership journey.',
    pages: '105-134',
  },
  {
    number: 6,
    title: 'The Power of Small Actions',
    description: 'How tiny steps compound into transformational change.',
    pages: '135-160',
  },
  {
    number: 7,
    title: 'From Insight to Impact',
    description: 'Translating awareness and agency into practical, meaningful action.',
    pages: '161-190',
  },
  {
    number: 8,
    title: 'Leading Through Complexity',
    description: 'Navigating uncertainty and ambiguity with calm confidence.',
    pages: '191-216',
  },
  {
    number: 9,
    title: 'Building Secure Base Organizations',
    description: 'Creating cultures where people can explore, risk, and grow.',
    pages: '217-242',
  },
  {
    number: 10,
    title: 'The Leader as Secure Base',
    description: 'Becoming the foundation others need to thrive.',
    pages: '243-268',
  },
  {
    number: 11,
    title: 'Sustaining the Journey',
    description: 'Maintaining momentum and avoiding relapse in leadership development.',
    pages: '269-280',
  },
  {
    number: 12,
    title: 'Leading Into the Future',
    description: 'Final reflections and a roadmap for continued growth.',
    pages: '281-296',
  },
];

export function TableOfContents() {
  return (
    <section className="py-24 bg-neutral-50 dark:bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              Table of Contents
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
              Inside the Book
            </h2>
            <p className="text-xl text-neutral-600 dark:text-gray-300">
              12 chapters packed with insights, frameworks, and practical tools for leadership transformation
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {chapters.map((chapter) => (
              <AccordionItem 
                key={chapter.number} 
                value={`chapter-${chapter.number}`}
                className="border-2 border-neutral-200 dark:border-neutral-800 rounded-lg px-6 hover:border-cyan-500/50 transition-colors"
              >
                <AccordionTrigger className="hover:no-underline py-6">
                  <div className="flex items-start gap-4 text-left">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                      <span className="text-cyan-500 font-bold">{chapter.number}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-1">
                        {chapter.title}
                      </h3>
                      <p className="text-sm text-neutral-500 dark:text-gray-400">
                        Pages {chapter.pages}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-6 pl-16">
                  <p className="text-neutral-600 dark:text-gray-300 leading-relaxed">
                    {chapter.description}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-neutral-600 dark:text-gray-400 mb-6">
              Plus: Foreword, Introduction, Conclusion, Resources, and Index
            </p>
            <a 
              href="#preorder"
              className="inline-block px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-medium rounded-full transition-colors"
            >
              Get Your Copy
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
