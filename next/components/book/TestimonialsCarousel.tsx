'use client';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { IconQuote } from '@tabler/icons-react';

const testimonials = [
  {
    quote: "Dr. Sung's coaching transformed how I lead. The 3 A's framework gave me the clarity I desperately needed.",
    author: "Sarah Chen",
    title: "CEO, Tech Startup",
    image: null,
  },
  {
    quote: "Finally, a leadership book that goes beyond platitudes. Peter's insights are grounded in real psychology and decades of experience.",
    author: "Michael Rodriguez",
    title: "VP of Operations, Fortune 500",
    image: null,
  },
  {
    quote: "The secure base concept revolutionized our organizational culture. This book is a must-read for every leader.",
    author: "Jennifer Park",
    title: "Chief People Officer",
    image: null,
  },
  {
    quote: "Peter helped me see the blind spots that were holding back my entire team. His framework works.",
    author: "David Thompson",
    title: "Executive Director, Non-Profit",
    image: null,
  },
  {
    quote: "I've read countless leadership books. This one actually changed my behavior—and my results.",
    author: "Lisa Anderson",
    title: "Managing Partner, Consulting Firm",
    image: null,
  },
];

export function TestimonialsCarousel() {
  return (
    <section className="py-24 bg-white dark:bg-charcoal">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
              What Leaders Are Saying
            </h2>
            <p className="text-xl text-neutral-600 dark:text-gray-300">
              From executives who've experienced the transformation firsthand
            </p>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full border-2 hover:border-cyan-500/50 transition-colors">
                    <CardContent className="p-6 flex flex-col h-full">
                      <IconQuote className="w-10 h-10 text-cyan-500/30 mb-4" />
                      
                      <blockquote className="flex-1 text-neutral-700 dark:text-gray-300 leading-relaxed mb-6">
                        "{testimonial.quote}"
                      </blockquote>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">
                            {testimonial.author.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-900 dark:text-white">
                            {testimonial.author}
                          </div>
                          <div className="text-sm text-neutral-500 dark:text-gray-400">
                            {testimonial.title}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-8">
              <CarouselPrevious className="relative left-0 translate-x-0" />
              <CarouselNext className="relative right-0 translate-x-0" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
