import { Metadata } from 'next';
import { BookComingSoon } from '@/components/book/BookComingSoon';

export const metadata: Metadata = {
  title: 'Good Leaders Do This - Coming Soon | Dr. Peter Sung',
  description: 'Dr. Peter Sung\'s upcoming book distills 30 years of leadership research into practical, research-backed principles. Be the first to know when it launches.',
  openGraph: {
    title: 'Good Leaders Do This - A New Book by Dr. Peter Sung',
    description: '30 years of leadership research, distilled into practice. Coming Q3 2025.',
    images: ['/images/book-cover-placeholder.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Good Leaders Do This - Coming Soon',
    description: 'Dr. Peter Sung\'s upcoming leadership book. Be the first to know.',
  },
};

export default function BookComingSoonPage() {
  return (
    <main className="min-h-screen">
      <BookComingSoon />
    </main>
  );
}
