import type { Metadata } from 'next';
import localFont from 'next/font/local';

import './globals.css';

// Inter (SIL Open Font License), bundled so the demo runs without network access.
const body = localFont({
  src: [
    { path: './fonts/Inter-Regular.woff2', weight: '400' },
    { path: './fonts/Inter-Medium.woff2', weight: '500' },
    { path: './fonts/Inter-SemiBold.woff2', weight: '600' },
  ],
  variable: '--font-body',
  display: 'swap',
});
const display = localFont({
  src: [
    { path: './fonts/InterDisplay-SemiBold.woff2', weight: '600' },
    { path: './fonts/InterDisplay-Bold.woff2', weight: '700' },
  ],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = { title: 'Meridian Mutual Group', description: 'Demo site' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning className={`${body.variable} ${display.variable}`}>
      <body suppressHydrationWarning className="font-sans">{children}</body>
    </html>
  );
}
