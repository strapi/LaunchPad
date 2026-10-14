import Link from 'next/link';

import { LocaleSwitcher } from './locale-switcher';
import { mediaUrl } from '@/lib/config';
import type { Locale } from '@/i18n.config';

export function SiteHeader({ locale, global, header, banner }: { locale: Locale; global: any; header: any; banner: any }) {
  const strip = (u: string) => (u || '/').replace(/^\/(en|fr|de|it)(?=\/|$)/, '') || '/';
  return (
    <header className="border-b border-ink/10 bg-white">
      {banner?.message && (
        <div className="bg-navy text-center text-sm text-white">
          <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-4 py-2">
            <span>{banner.message}</span>
            {banner.ctaLabel && <Link href={`/${locale}${strip(banner.ctaUrl)}`} className="rounded bg-teal px-2 py-0.5 text-xs font-semibold">{banner.ctaLabel}</Link>}
          </div>
        </div>
      )}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <Link href={`/${locale}`} className="flex items-center gap-3">
          {mediaUrl(global?.logo) ? <img src={mediaUrl(global.logo)!} alt={global?.siteName} className="h-9" /> : <span className="text-xl font-bold text-navy">{global?.siteName}</span>}
        </Link>
        <nav className="hidden gap-6 text-sm font-medium text-ink/80 md:flex">
          {(header?.links || []).map((l: any) => (
            <Link key={l.id ?? l.url} href={`/${locale}${strip(l.url)}`} className="hover:text-navy">{l.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <LocaleSwitcher locale={locale} />
          {header?.ctaLabel && <Link href={`/${locale}${strip(header.ctaUrl)}`} className="rounded-md bg-teal px-4 py-2 text-sm font-semibold text-white">{header.ctaLabel}</Link>}
        </div>
      </div>
    </header>
  );
}
