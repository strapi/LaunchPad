import './globals.css';

import type { Viewport } from 'next';
import { Outfit } from 'next/font/google';

import { SlugProvider } from './context/SlugContext';
import { Preview } from '@/components/preview';
import { Locale, i18n } from '@/i18n.config';
import { cn } from '@/lib/utils';
import { Providers } from './Providers';
import { TailwindIndicator } from '@/lib/utils/TailwindIndicator';

// Configuration de la police Outfit
const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
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
    <html lang="fr" suppressHydrationWarning className={outfit.variable}>
      <body
        className={cn(
          'min-h-screen bg-background text-foreground font-sans antialiased',
          outfit.className
        )}
      >
        <Providers>
          <Preview />
          <SlugProvider>{children}</SlugProvider>
          <TailwindIndicator />
        </Providers>
      </body>
    </html>
  );
}