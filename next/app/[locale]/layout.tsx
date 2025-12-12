import { Metadata } from 'next';
import { ViewTransitions } from 'next-view-transitions';
import { Inter } from 'next/font/google';
import { draftMode } from 'next/headers';
import React from 'react';

import { DraftModeBanner } from '@/components/draft-mode-banner';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { AIToast } from '@/components/toast';
import { CartProvider } from '@/context/cart-context';
import { generateMetadataObject } from '@/lib/shared/metadata';
import { fetchSingleType } from '@/lib/strapi';
import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

// Default Global SEO for pages without them
export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const pageData = await fetchSingleType('global', { locale: params.locale });

  const seo = pageData.seo;
  const metadata = generateMetadataObject(seo);
  return metadata;
}

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;

  const { children } = props;

  const { isEnabled: isDraftMode } = await draftMode();

  const pageData = await fetchSingleType('global', { locale: params.locale });

  return (
    <ViewTransitions>
      <CartProvider>
        <div
          className={cn(
            // inter.className,
            'antialiased h-full w-full'
          )}
        >
          {/* Navbar full width */}
          <Navbar data={pageData?.navbar} locale={locale} />

          {/*
                Main content with max-width constraint 
                max-w-6xl → 1152px (recommandé pour sites compacts)
                max-w-7xl → 1280px (standard, équilibré) ✅
                max-w-[1440px] → 1440px (pour sites larges)
                max-w-[1600px] → 1600px (très large)
           */}
          <main className="w-full min-h-full">
            {/* <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> */}
            <div className="mx-auto max-w-[1600px]">
              {children}
            </div>
          </main>

          {/* Footer full width */}
          <Footer data={pageData.footer} locale={locale} />

          <AIToast />
          {isDraftMode && <DraftModeBanner />}
        </div>
      </CartProvider>
    </ViewTransitions>
  );
}