import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({ width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true, ...p });

export const Icon = {
  motor: (p: P) => <svg {...base(p)}><path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11" /><rect x="3" y="11" width="18" height="7" rx="2" /><circle cx="7.5" cy="18" r="1.5" /><circle cx="16.5" cy="18" r="1.5" /></svg>,
  home: (p: P) => <svg {...base(p)}><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>,
  health: (p: P) => <svg {...base(p)}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" /></svg>,
  life: (p: P) => <svg {...base(p)}><path d="M3 12a9 9 0 0 1 18 0H3z" /><path d="M12 12v6a2 2 0 0 1-4 0" /></svg>,
  savings: (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="8" /><path d="M9.5 10.5h5M9.5 13.5h5M12 8v8" /></svg>,
  travel: (p: P) => <svg {...base(p)}><rect x="3" y="8" width="18" height="12" rx="2" /><path d="M9 8V5h6v3M8 8v12M16 8v12" /></svg>,
  pet: (p: P) => <svg {...base(p)}><circle cx="7" cy="9" r="1.6" /><circle cx="11" cy="6.5" r="1.6" /><circle cx="15.5" cy="7" r="1.6" /><circle cx="18.5" cy="10.5" r="1.6" /><path d="M9 18.5c0-2.5 2-5 4-5s4 2.5 4 5c0 1.5-1 2-2.5 2S12 20 12 20s-1.5.5-3 .5S9 20 9 18.5z" /></svg>,
  business: (p: P) => <svg {...base(p)}><path d="M12 3l8 3v6c0 4.5-3.5 7.5-8 9-4.5-1.5-8-4.5-8-9V6l8-3z" /><path d="M9 12l2 2 4-4" /></svg>,
  check: (p: P) => <svg {...base(p)}><path d="M5 12l5 5L19 7" /></svg>,
  cross: (p: P) => <svg {...base(p)}><path d="M7 7l10 10M17 7L7 17" /></svg>,
  chevron: (p: P) => <svg {...base(p)}><path d="M6 9l6 6 6-6" /></svg>,
  arrow: (p: P) => <svg {...base(p)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>,
  phone: (p: P) => <svg {...base(p)}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>,
  doc: (p: P) => <svg {...base(p)}><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5M10 13h6M10 17h6" /></svg>,
  globe: (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>,
  clock: (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
  pin: (p: P) => <svg {...base(p)}><path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z" /><circle cx="12" cy="10" r="2" /></svg>,
};

export type CategoryKey = 'motor' | 'home' | 'health' | 'life' | 'savings' | 'travel' | 'pet' | 'business';
export function CategoryIcon({ category, ...p }: { category?: string } & P) {
  const C = (Icon as any)[category || ''] || Icon.business;
  return <C {...p} />;
}
