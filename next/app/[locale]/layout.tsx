import { Metadata } from 'next';
import { ViewTransitions } from 'next-view-transitions';
import { Inter } from 'next/font/google';
import React from 'react';

import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { CartProvider } from '@/context/cart-context';
import { generateMetadataObject } from '@/lib/shared/metadata';
import fetchContentType from '@/lib/strapi/fetchContentType';
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
  const pageData = await fetchContentType(
    'global',
    {
      filters: { locale: params.locale },
      populate: 'seo.metaImage',
    },
    true
  );

  const seo = pageData?.seo;
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

  const pageData = await fetchContentType(
    'global',
    { filters: { locale } },
    true
  );
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
        </div>
      </CartProvider>
    </ViewTransitions>
  );
}
