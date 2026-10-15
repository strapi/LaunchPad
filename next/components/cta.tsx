import Link from 'next/link';

import { Icon } from './icons';

// The `variant` field on the shared.cta component maps to these styles; `onDark` picks the set that reads on a navy background.
const styles: Record<string, string> = {
  primary: 'btn-primary',
  secondary: 'btn-navy',
  outline: 'btn-outline',
  light: 'btn-light',
};
const stylesOnDark: Record<string, string> = {
  primary: 'btn-primary',
  secondary: 'btn-light',
  outline: 'btn border border-white/40 text-white hover:bg-white/10',
  light: 'btn-light',
};

export function Cta({ cta, locale, onDark = false }: { cta?: { label: string; url: string; variant?: string } | null; locale: string; onDark?: boolean }) {
  if (!cta?.label) return null;
  const href = cta.url?.startsWith('/') && !cta.url.startsWith(`/${locale}`) ? `/${locale}${cta.url.replace(/^\/(en|fr|de|it)/, '')}` : cta.url || '#';
  const set = onDark ? stylesOnDark : styles;
  return (
    <Link href={href} className={set[cta.variant || 'primary'] || set.primary}>
      {cta.label} <Icon.arrow width={16} height={16} />
    </Link>
  );
}
