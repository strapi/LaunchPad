'use client';

import Link from 'next/link';
import { useState } from 'react';

import { LocaleSwitcher } from './locale-switcher';
import type { Locale } from '@/i18n.config';

export function MobileNav({ locale, links, cta }: { locale: Locale; links: { label: string; href: string }[]; cta: { label: string; href: string } | null }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <button aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)} className="flex h-10 w-10 items-center justify-center rounded-full text-navy hover:bg-navy/5">
        <span className="relative block h-3.5 w-5">
          <span className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition ${open ? 'translate-y-1.5 rotate-45' : ''}`} />
          <span className={`absolute left-0 top-1.5 h-0.5 w-5 bg-current transition ${open ? 'opacity-0' : ''}`} />
          <span className={`absolute left-0 top-3 h-0.5 w-5 bg-current transition ${open ? '-translate-y-1.5 -rotate-45' : ''}`} />
        </span>
      </button>
      {open && (
        <div className="absolute inset-x-0 top-full border-b border-line bg-white shadow-lift">
          <nav className="wrap flex flex-col py-4">
            {links.map((l) => <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-base font-medium text-navy hover:bg-navy/5">{l.label}</Link>)}
            <div className="mt-3 flex items-center justify-between px-3">
              <LocaleSwitcher locale={locale} />
              {cta && <Link href={cta.href} onClick={() => setOpen(false)} className="btn-primary">{cta.label}</Link>}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
