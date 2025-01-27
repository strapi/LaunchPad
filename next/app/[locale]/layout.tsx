import React from 'react'

import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { generateMetadataObject } from '@/lib/shared/metadata';

import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { CartProvider } from '@/context/cart-context';
import { cn } from '@/lib/utils';
import { ViewTransitions } from 'next-view-transitions';
import fetchContentType from '@/lib/strapi/fetchContentType';

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    weight: ["400", "500", "600", "700", "800", "900"],
});

// Default Global SEO for pages without them
export async function generateMetadata({
    params,
}: {
    params: { locale: string; slug: string };
}): Promise<Metadata> {
    const pageData = await fetchContentType(
        'global',
        {
            filters: { locale: params.locale },
            populate: "seo.metaImage",
        },
        true
    );

    const seo = pageData?.seo;
    const metadata = generateMetadataObject(seo);
    return metadata;
}

export default async function LocaleLayout({
    children,
    params: { locale }
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {

    const pageData = await fetchContentType('global', { filters: { locale } }, true);
    return (
        <html lang={locale}>
            <ViewTransitions>
                <CartProvider>
                    <body
                        className={cn(
                            inter.className,
                            "bg-charcoal antialiased h-full w-full"
                        )}
                    >
                        <Navbar data={pageData.navbar} locale={locale} />
                        {children}
                        <Footer data={pageData.footer} locale={locale} />
                    </body>
                </CartProvider>
            </ViewTransitions>
        </html>
    );
}