import React, { useEffect, useState } from 'react'
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { CartProvider } from '@/context/cart-context';
import { cn } from '@/lib/utils';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ViewTransitions } from 'next-view-transitions';
import { Inter } from 'next/font/google';
import fetchContentType from '@/lib/strapi/fetchContentType';

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    weight: ["400", "500", "600", "700", "800", "900"],
});

export default async function LocaleLayout({
    children,
    params: { locale }
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {

    const pageData = await fetchContentType('global', `filters[locale][$eq]=${locale}`, true);
    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <NextIntlClientProvider messages={messages}>
                <ViewTransitions>
                    <CartProvider>
                        <body
                            className={cn(
                                inter.className,
                                "bg-charcoal antialiased h-full w-full"
                            )}
                        >
                            <Navbar data={pageData.navbar} />
                            {children}
                            <Footer data={pageData.footer} />
                        </body>
                    </CartProvider>
                </ViewTransitions>
            </NextIntlClientProvider>
        </html>
    );
}