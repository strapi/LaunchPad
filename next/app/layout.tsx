import type { Viewport } from "next";

import { Inter } from "next/font/google";
import "./globals.css";
import seoData from "@/lib/next-metadata";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

// export const metadata = {
//   metadataBase: new URL(seoData.openGraph.url),
//   title: {
//     default: seoData.openGraph.title,
//     template: " %s",
//   },
//   description: seoData.openGraph.description,
//   keywords: seoData.openGraph.keywords,
//   openGraph: {
//     type: "website",
//     description: seoData.openGraph.description,
//     url: seoData.openGraph.url,
//     title: seoData.openGraph.title,
//     locale: "en_EN",
//     siteName: "ui.aceternity.com", //TODO: Fix this
//     images: [
//       {
//         width: 1200,
//         height: 630,
//         url: seoData.openGraph.images[0].url,
//         alt: seoData.openGraph.title,
//       },
//     ],
//   },
//   twitter: {
//     card: seoData.twitter.cardType,
//     title: seoData.openGraph.title,
//     description: seoData.openGraph.description,
//     creator: seoData.twitter.handle,
//     site: "ui.aceternity.com", // TODO: Fix this
//     images: [seoData.openGraph.images[0].url],
//   },
//   robots: {
//     nosnippet: false,
//     notranslate: true,
//     noimageindex: false,
//     noarchive: false,
//     maxSnippet: -1,
//     maxImagePreview: "large",
//     maxVideoPreview: -1,
//   },
// };

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#06b6d4" },
    { media: "(prefers-color-scheme: dark)", color: "#06b6d4" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      {children}
    </html>
  );
}
