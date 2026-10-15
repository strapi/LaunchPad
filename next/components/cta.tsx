import Link from 'next/link';

import { Icon } from './icons';

const styles: Record<string, string> = {
  primary: 'btn-primary',
  secondary: 'btn-navy',
  outline: 'btn-outline',
  light: 'btn-light',
};

export function Cta({ cta, locale }: { cta?: { label: string; url: string; variant?: string } | null; locale: string }) {
  if (!cta?.label) return null;
  const href = cta.url?.startsWith('/') && !cta.url.startsWith(`/${locale}`) ? `/${locale}${cta.url.replace(/^\/(en|fr|de|it)/, '')}` : cta.url || '#';
  return (
    <Link href={href} className={styles[cta.variant || 'primary'] || styles.primary}>
      {cta.label} <Icon.arrow width={16} height={16} />
    </Link>
  );
}
