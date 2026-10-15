import Link from 'next/link';

import { Icon } from './icons';
import { LocaleSwitcher } from './locale-switcher';
import { MobileNav } from './mobile-nav';
import { mediaUrl } from '@/lib/config';
import { dict } from '@/lib/i18n';
import type { Locale } from '@/i18n.config';

export const strip = (u: string) => (u || '/').replace(/^\/(en|fr|de|it)(?=\/|$)/, '') || '/';

export function SiteHeader({ locale, global, header, banner }: { locale: Locale; global: any; header: any; banner: any }) {
  const t = dict(locale);
  const links = (header?.links || []).map((l: any) => ({ label: l.label, href: `/${locale}${strip(l.url)}` }));
  const cta = header?.ctaLabel ? { label: header.ctaLabel, href: `/${locale}${strip(header.ctaUrl)}` } : null;
  return (
    <header className="sticky top-0 z-40">
      {banner?.message && (
        <div className="bg-navy text-white">
          <div className="wrap flex items-center justify-center gap-3 py-2 text-center text-sm">
            <span className="text-white/90">{banner.message}</span>
            {banner.ctaLabel && (
              <Link href={`/${locale}${strip(banner.ctaUrl)}`} className="inline-flex items-center gap-1 rounded-full bg-amber px-3 py-0.5 text-xs font-semibold text-navy hover:bg-amber/90">
                {banner.ctaLabel} <Icon.arrow width={14} height={14} />
              </Link>
            )}
          </div>
        </div>
      )}
      <div className="hidden border-b border-line bg-sand text-xs text-ink-600 md:block">
        <div className="wrap flex h-9 items-center justify-between">
          <div className="flex items-center gap-6">
            {global?.contactPhone && <span className="inline-flex items-center gap-1.5"><Icon.phone width={14} height={14} className="text-teal" /> {global.contactPhone}</span>}
            <span className="inline-flex items-center gap-1.5"><Icon.clock width={14} height={14} className="text-teal" /> {t.claims247}</span>
          </div>
          <LocaleSwitcher locale={locale} />
        </div>
      </div>
      <div className="border-b border-line bg-white/90 backdrop-blur">
        <div className="wrap flex h-[72px] items-center justify-between gap-6">
          <Link href={`/${locale}`} className="flex shrink-0 items-center" aria-label={global?.siteName}>
            {mediaUrl(global?.logo) ? <img src={mediaUrl(global.logo)!} alt={global?.siteName} className="h-10" /> : <span className="font-display text-xl font-bold text-navy">{global?.siteName}</span>}
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((l: any) => (
              <Link key={l.href} href={l.href} className="rounded-full px-4 py-2 text-[15px] font-medium text-ink-600 transition hover:bg-navy/5 hover:text-navy">{l.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {cta && <Link href={cta.href} className="btn-primary hidden md:inline-flex">{cta.label}</Link>}
            <MobileNav locale={locale} links={links} cta={cta} />
          </div>
        </div>
      </div>
    </header>
  );
}
