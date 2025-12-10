import { Metadata } from 'next';
import { ViewTransitions } from 'next-view-transitions';
import { Inter } from 'next/font/google';
import { draftMode } from 'next/headers';
import type { PropsWithChildren } from 'react';
import React from 'react';

import { DraftModeBanner } from '@/components/draft-mode-banner';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { AIToast } from '@/components/toast';
import { CartProvider } from '@/context/cart-context';
import { generateMetadataObject } from '@/lib/shared/metadata';
import { fetchSingleType } from '@/lib/strapi';
import { cn } from '@/lib/utils';

type LocaleParams = {
  params: Promise<{ locale: string }>;
};
type LocaleLayoutProps = PropsWithChildren<LocaleParams>;

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

// Default Global SEO for pages without them
export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  const pageData = await fetchSingleType('global', { locale });

  const seo = pageData.seo;
  const metadata = generateMetadataObject(seo);
  return metadata;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { isEnabled: isDraftMode } = await draftMode();
  const { locale } = await params;
  const pageData = await fetchSingleType('global', { locale });

  return (
    <ViewTransitions>
      <CartProvider>
        <div
          className={cn(
            inter.className,
            'bg-charcoal antialiased h-full w-full'
          )}
        >
          <Navbar data={pageData.navbar} locale={locale} />
          {children}
          <Footer data={pageData.footer} locale={locale} />
          <AIToast />
          {isDraftMode && <DraftModeBanner />}
        </div>
      </CartProvider>
    </ViewTransitions>
  );
}
