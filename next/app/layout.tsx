import type { Viewport } from 'next';
import { Suspense } from 'react';

import { i18n } from '@/i18n.config';

import './globals.css';

import { SlugProvider } from './context/SlugContext';
import { Preview } from '@/components/preview';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#06b6d4' },
    { media: '(prefers-color-scheme: dark)', color: '#06b6d4' },
  ],
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Preview />
        <SlugProvider>
          <Suspense fallback={<RootLoading />}>{children}</Suspense>
        </SlugProvider>
      </body>
    </html>
  );
}
