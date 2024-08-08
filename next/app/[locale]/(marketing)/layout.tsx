import { Metadata } from "next";
import seoData from "@/lib/next-metadata";
import { unstable_setRequestLocale } from "next-intl/server";
import { Locale } from "@/config";

export const metadata: Metadata = {
  title: seoData.title,
  description: seoData.description,
  openGraph: {
    title: seoData.openGraph.title,
    description: seoData.openGraph.description,
    images: seoData.openGraph.images,
  },
};
export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: Locale };
}>) {
  unstable_setRequestLocale(locale);
  return <main>{children}</main>;
}
