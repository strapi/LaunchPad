import type { Viewport } from 'next';

import { Inter, Newsreader } from 'next/font/google';

import { Locale, i18n } from '@/i18n.config';

import './globals.css';

import { SlugProvider } from './context/SlugContext';
import { Preview } from '@/components/preview';
import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#06b6d4' },
    { media: '(prefers-color-scheme: dark)', color: '#06b6d4' },
  ],
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          inter.variable,
          newsreader.variable,
          'relative min-h-screen bg-white dark:bg-charcoal text-neutral-900 dark:text-text-primary transition-colors duration-300'
        )}
      >
        <Preview />
        <SlugProvider>{children}</SlugProvider>
      </body>
    </html>
  );
}
