import Link from 'next/link';

const styles: Record<string, string> = {
  primary: 'bg-teal text-white hover:bg-teal/90',
  secondary: 'bg-navy text-white hover:bg-navy/90',
  outline: 'border border-navy text-navy hover:bg-navy/5',
};

export function Cta({ cta, locale }: { cta?: { label: string; url: string; variant?: string } | null; locale: string }) {
  if (!cta?.label) return null;
  const href = cta.url?.startsWith('/') && !cta.url.startsWith(`/${locale}`) ? `/${locale}${cta.url.replace(/^\/(en|fr|de|it)/, '')}` : cta.url || '#';
  return (
    <Link href={href} className={`inline-block rounded-md px-5 py-2.5 text-sm font-semibold transition ${styles[cta.variant || 'primary']}`}>
      {cta.label}
    </Link>
  );
}
