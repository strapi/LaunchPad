import Link from 'next/link';

import { dict } from '@/lib/i18n';
import type { Locale } from '@/i18n.config';

export function SiteFooter({ locale, global, footer }: { locale: Locale; global: any; footer: any }) {
  const t = dict(locale);
  const strip = (u: string) => (u || '/').replace(/^\/(en|fr|de|it)(?=\/|$)/, '') || '/';
  return (
    <footer className="mt-16 border-t border-ink/10 bg-sand/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="text-lg font-bold text-navy">{global?.siteName}</div>
          {global?.contactPhone && <div className="mt-2 text-sm text-ink/70">{global.contactPhone}</div>}
        </div>
        {(footer?.groups || []).map((g: any) => (
          <div key={g.id ?? g.title}>
            <div className="text-sm font-semibold text-navy">{g.title}</div>
            <ul className="mt-2 space-y-1 text-sm text-ink/70">
              {(g.links || []).map((l: any) => <li key={l.id ?? l.url}><Link href={`/${locale}${strip(l.url)}`} className="hover:underline">{l.label}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-ink/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-ink/60 md:flex-row md:justify-between">
          <span>{global?.legalFooter}</span>
          <span className="flex gap-3">{(footer?.legalLines || []).map((x: string) => <span key={x}>{x}</span>)}</span>
        </div>
        <div className="bg-coral/10 py-1 text-center text-[11px] text-coral">{t.demo}</div>
      </div>
    </footer>
  );
}
