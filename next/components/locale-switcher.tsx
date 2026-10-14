'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { i18n, localeLabels, type Locale } from '@/i18n.config';

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() || '/';
  const rest = pathname.replace(/^\/(en|fr|de|it)(?=\/|$)/, '');
  return (
    <div className="flex gap-1 text-xs font-semibold">
      {i18n.locales.map((l) => (
        <Link key={l} href={`/${l}${rest}`} className={`rounded px-2 py-1 ${l === locale ? 'bg-navy text-white' : 'text-ink/60 hover:bg-ink/5'}`}>
          {localeLabels[l]}
        </Link>
      ))}
    </div>
  );
}
