import Link from 'next/link';

import type { Locale } from '@/i18n.config';
import { getNews, getPressReleases } from '@/lib/content';
import { dict } from '@/lib/i18n';
import { mediaUrl } from '@/lib/config';

export default async function News({ params }: PageProps<'/[locale]/news'>) {
  const { locale } = await params;
  const l = locale as Locale;
  const [news, press] = await Promise.all([getNews(l), getPressReleases()]);
  const t = dict(l);
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-navy">{t.news}</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {news.map((n: any) => (
          <Link key={n.documentId} href={`/${l}/news/${n.slug}`} className="rounded-xl border border-ink/10 p-5 hover:border-teal">
            {mediaUrl(n.cover) && <img src={mediaUrl(n.cover)!} alt="" className="mb-4 h-40 w-full rounded-lg object-cover" />}
            <div className="text-xs uppercase tracking-wide text-teal">{n.market} · {n.publishedOn}</div>
            <h2 className="mt-1 text-xl font-bold text-navy">{n.title}</h2>
            <p className="mt-2 text-sm text-ink/70">{n.excerpt}</p>
          </Link>
        ))}
      </div>
      <h2 className="mt-16 text-2xl font-bold text-navy">{t.press}</h2>
      <ul className="mt-6 divide-y divide-ink/10 rounded-xl border border-ink/10">
        {press.map((p: any) => (
          <li key={p.documentId} className="px-4 py-3">
            <Link href={`/${l}/press/${p.slug}`} className="font-medium text-navy hover:underline">{p.title}</Link>
            <span className="ml-3 text-xs text-ink/50">{p.publishedOn}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
