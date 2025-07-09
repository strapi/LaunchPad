import { Inter, Noto_Sans_Arabic, Noto_Sans } from 'next/font/google'

// English font (existing)
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: '--font-inter',
});

// Persian/Farsi font from Google Fonts
export const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: '--font-persian',
});

// Alternative Persian font
export const notoSans = Noto_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: '--font-fallback',
});
