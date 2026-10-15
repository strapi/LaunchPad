'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Icon } from './icons';
import { i18n, localeLabels, type Locale } from '@/i18n.config';

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() || '/';
  const rest = pathname.replace(/^\/(en|fr|de|it)(?=\/|$)/, '');
  return (
    <div className="flex items-center gap-1 text-xs font-semibold">
      <Icon.globe width={14} height={14} className="mr-1 text-ink-400" />
      {i18n.locales.map((l) => (
        <Link key={l} href={`/${l}${rest}`} aria-current={l === locale ? 'true' : undefined} className={`rounded-full px-2 py-0.5 transition ${l === locale ? 'bg-navy text-white' : 'text-ink-600 hover:bg-navy/10'}`}>
          {localeLabels[l]}
        </Link>
      ))}
    </div>
  );
}
