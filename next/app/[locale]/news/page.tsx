import Link from 'next/link';

import { NewsCard } from '@/components/blocks';
import { Icon } from '@/components/icons';
import type { Locale } from '@/i18n.config';
import { getNews, getPressReleases } from '@/lib/content';
import { dict, formatDate } from '@/lib/i18n';

export default async function News({ params }: PageProps<'/[locale]/news'>) {
  const { locale } = await params;
  const l = locale as Locale;
  const [news, press] = await Promise.all([getNews(l), getPressReleases()]);
  const t = dict(l);
  const [first, ...others] = news;
  return (
    <>
      <section className="bg-sand">
        <div className="wrap py-14 md:py-20">
          <div className="eyebrow">{t.news}</div>
          <h1 className="h-display mt-2 text-4xl md:text-5xl">{t.latestNews}</h1>
        </div>
      </section>
      <section className="wrap grid gap-12 py-14 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="grid gap-8 md:grid-cols-2">
            {first && <NewsCard n={first} locale={l} big />}
            {others.map((n: any) => <NewsCard key={n.documentId} n={n} locale={l} />)}
          </div>
        </div>
        <aside className="lg:col-span-4">
          <div className="card sticky top-32 p-6">
            <div className="eyebrow">{t.pressKit}</div>
            <h2 className="h-display mt-2 text-xl">{t.press}</h2>
            <ul className="mt-4 divide-y divide-line">
              {press.map((p: any) => (
                <li key={p.documentId} className="py-3">
                  <Link href={`/${l}/press/${p.slug}`} className="group block">
                    <div className="text-xs text-ink-400">{formatDate(p.publishedOn, l)}</div>
                    <div className="mt-0.5 font-semibold leading-snug text-navy group-hover:underline">{p.title}</div>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href={`/${l}/contact`} className="btn-outline mt-4 w-full">{t.talkToAgent} <Icon.arrow width={16} height={16} /></Link>
          </div>
        </aside>
      </section>
    </>
  );
}
