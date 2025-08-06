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
import { isRTLLocale } from '@/lib/rtl';

// You can import additional fonts here
// import { persianFont } from '@/lib/fonts';
// import { notoSansArabic } from '@/lib/google-fonts';

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
        
    // Fallback: If Persian locale doesn't have complete navbar data, use English as fallback
    let navbarData = pageData?.navbar;
    if (!navbarData || !navbarData.logo) {
        console.log('Missing navbar data for locale:', locale, 'falling back to English');
        const fallbackData = await fetchContentType('global', { filters: { locale: 'en' } }, true);
        navbarData = fallbackData?.navbar;
    }
    
    // Check if locale is RTL
    const isRTL = isRTLLocale(locale);
    
    // Choose appropriate font based on locale
    const getFontClass = () => {
        switch (locale) {
            case 'fa':
                // Use Persian font for Farsi
                // return persianFont.className; // if using local fonts
                // return notoSansArabic.className; // if using Google fonts
                return `${inter.className} font-persian`; // Apply Persian font utility
            case 'ar':
                // Use Arabic font
                // return arabicFont.className;
                return `${inter.className} font-arabic`; // Apply Arabic font utility
            case 'he':
                return `${inter.className} font-hebrew`; // Apply Hebrew font utility
            default:
                return `${inter.className} font-latin`; // Apply Latin font utility
        }
    };
    
    return (
        <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
            <ViewTransitions>
                <CartProvider>
                    <body
                        className={cn(
                            getFontClass(),
                            "bg-charcoal antialiased h-full w-full"
                        )}
                    >
                        <Navbar data={navbarData} locale={locale} />
                        {children}
                        <Footer data={pageData.footer} locale={locale} />
                    </body>
                </CartProvider>
            </ViewTransitions>
        </html>
    );
}