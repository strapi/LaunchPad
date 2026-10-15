import Link from 'next/link';

import { Icon } from './icons';
import { strip } from './site-header';
import { mediaUrl } from '@/lib/config';
import { dict } from '@/lib/i18n';
import { i18n, localeLabels, type Locale } from '@/i18n.config';

const localeNames: Record<Locale, string> = { en: 'International (English)', fr: 'France', de: 'Deutschland', it: 'Italia' };

export function SiteFooter({ locale, global, footer }: { locale: Locale; global: any; footer: any }) {
  const t = dict(locale);
  return (
    <footer className="mt-24 bg-navy text-white">
      <div className="wrap grid gap-10 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          {mediaUrl(global?.logo) ? <img src={mediaUrl(global.logo)!} alt={global?.siteName} className="h-10 brightness-0 invert" /> : <div className="font-display text-xl font-bold">{global?.siteName}</div>}
          {global?.contactPhone && (
            <a href={`tel:${global.contactPhone.replace(/\s/g, '')}`} className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm hover:bg-white/15">
              <Icon.phone className="text-amber" />
              <span><span className="block text-xs text-white/60">{t.claims247}</span><span className="font-semibold">{global.contactPhone}</span></span>
            </a>
          )}
          <div className="mt-8">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">{t.followUs}</div>
            <ul className="mt-3 flex flex-wrap gap-2">
              {i18n.locales.map((l) => (
                <li key={l}><Link href={`/${l}`} className={`rounded-full border px-3 py-1 text-xs ${l === locale ? 'border-amber text-amber' : 'border-white/20 text-white/70 hover:border-white/50'}`}>{localeNames[l]} · {localeLabels[l]}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-3 md:col-span-8">
          {(footer?.groups || []).map((g: any) => (
            <div key={g.id ?? g.title}>
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">{g.title}</div>
              <ul className="mt-4 space-y-2.5 text-[15px]">
                {(g.links || []).map((l: any) => <li key={l.id ?? l.url}><Link href={`/${locale}${strip(l.url)}`} className="text-white/85 hover:text-white hover:underline">{l.label}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-col gap-4 py-6 text-xs text-white/55 md:flex-row md:items-start md:justify-between">
          <p className="max-w-2xl leading-relaxed">{global?.legalFooter}</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-1">{(footer?.legalLines || []).map((x: string) => <li key={x} className="hover:text-white">{x}</li>)}</ul>
        </div>
      </div>
      <div className="bg-navy-900 py-1.5 text-center text-[11px] text-white/40">{t.demo}</div>
    </footer>
  );
}
