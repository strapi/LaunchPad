import Link from 'next/link';
import { notFound } from 'next/navigation';

import { RichText } from '@/components/rich-text';
import type { Locale } from '@/i18n.config';
import { getPressRelease } from '@/lib/content';
import { dict } from '@/lib/i18n';

export default async function PressRelease({ params }: PageProps<'/[locale]/press/[slug]'>) {
  const { locale, slug } = await params;
  const l = locale as Locale;
  const p = await getPressRelease(slug);
  if (!p) notFound();
  const t = dict(l);
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <div className="text-xs uppercase tracking-wide text-teal">{t.press} · {p.publishedOn}</div>
      <h1 className="mt-2 text-3xl font-bold text-navy">{p.title}</h1>
      <RichText content={p.body} className="mt-6 text-lg text-ink/80" />
      <Link href={`/${l}/news`} className="mt-8 inline-block text-sm text-teal underline">← {t.news}</Link>
    </article>
  );
}
