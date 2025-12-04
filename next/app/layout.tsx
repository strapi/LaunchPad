import './globals.css';
import type { Viewport } from 'next';

import { Locale, i18n } from '@/i18n.config';
import { ThemeProvider } from "next-themes"
import { SlugProvider } from './context/SlugContext';
import { Preview } from '@/components/preview';
import { cn } from '@/lib/utils';

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
    <html lang="fr" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
      )} >
        <ThemeProvider attribute="class" defaultTheme='light'>
          <Preview />
          <SlugProvider>{children}</SlugProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
