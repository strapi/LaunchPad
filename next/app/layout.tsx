import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = { title: 'Meridian Mutual Group', description: 'Demo site' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
