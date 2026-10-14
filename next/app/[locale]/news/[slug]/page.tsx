import Link from 'next/link';
import { notFound } from 'next/navigation';

import { RichText } from '@/components/rich-text';
import type { Locale } from '@/i18n.config';
import { getNewsItem } from '@/lib/content';
import { dict } from '@/lib/i18n';
import { mediaUrl } from '@/lib/config';

export default async function NewsItem({ params }: PageProps<'/[locale]/news/[slug]'>) {
  const { locale, slug } = await params;
  const l = locale as Locale;
  const n = await getNewsItem(l, slug);
  if (!n) notFound();
  const t = dict(l);
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <div className="text-xs uppercase tracking-wide text-teal">{n.market} · {n.publishedOn}</div>
      <h1 className="mt-2 text-3xl font-bold text-navy">{n.title}</h1>
      {mediaUrl(n.cover) && <img src={mediaUrl(n.cover)!} alt="" className="my-6 h-64 w-full rounded-xl object-cover" />}
      <RichText content={n.body} className="text-lg text-ink/80" />
      <Link href={`/${l}/news`} className="mt-8 inline-block text-sm text-teal underline">← {t.news}</Link>
    </article>
  );
}
