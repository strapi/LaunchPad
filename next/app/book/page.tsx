import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { BookHero } from '@/components/book/BookHero';
import { BookOverview } from '@/components/book/BookOverview';
import { TableOfContents } from '@/components/book/TableOfContents';
import { AuthorSection } from '@/components/book/AuthorSection';
import { TestimonialsCarousel } from '@/components/book/TestimonialsCarousel';
import { PreorderSection } from '@/components/book/PreorderSection';
import { CoachingUpsell } from '@/components/book/CoachingUpsell';
import { BookFAQ } from '@/components/book/BookFAQ';

export const metadata: Metadata = {
  title: 'The Secure Base: Leading from Awareness, Agency, and Action | Dr. Peter Sung',
  description: 'Preorder Dr. Peter Sung\'s groundbreaking book on leadership transformation. Limited signed copies available.',
  openGraph: {
    title: 'The Secure Base by Dr. Peter Sung',
    description: 'A proven framework for transforming leadership through self-awareness',
    images: ['/images/book-cover-placeholder.png'],
  },
};

export default function BookPage() {
  return (
    <main className="min-h-screen">
      <BookHero />
      <BookOverview />
      <TableOfContents />
      <TestimonialsCarousel />
      <AuthorSection />
      <PreorderSection />
      <CoachingUpsell />
      <BookFAQ />
      
      {/* Newsletter Section */}
      <section className="py-24 bg-gradient-to-b from-zinc-900/50 to-charcoal">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-gray-300 mb-8">
              Get notified when the book launches and receive exclusive leadership insights.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-medium rounded-lg transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
