import type { Viewport } from 'next';

import { Locale, i18n } from '@/i18n.config';
import { ThemeProvider } from "next-themes"

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ThemeProvider attribute="class" defaultTheme='light' storageKey="theme">
        <body suppressHydrationWarning>
          <Preview />
          <SlugProvider>{children}</SlugProvider>
        </body>
      </ThemeProvider>
    </html>
  );
}
