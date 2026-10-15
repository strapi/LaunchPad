import Link from 'next/link';
import { notFound } from 'next/navigation';

import { NewsCard } from '@/components/blocks';
import { Icon } from '@/components/icons';
import { RichText } from '@/components/rich-text';
import type { Locale } from '@/i18n.config';
import { mediaUrl } from '@/lib/config';
import { getNews, getNewsItem } from '@/lib/content';
import { dict, formatDate } from '@/lib/i18n';

export default async function NewsItem({ params }: PageProps<'/[locale]/news/[slug]'>) {
  const { locale, slug } = await params;
  const l = locale as Locale;
  const [n, all] = await Promise.all([getNewsItem(l, slug), getNews(l)]);
  if (!n) notFound();
  const t = dict(l);
  const more = all.filter((x: any) => x.slug !== slug).slice(0, 3);
  const img = mediaUrl(n.cover);
  return (
    <>
      <article className="wrap py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <Link href={`/${l}/news`} className="inline-flex items-center gap-1 text-sm font-medium text-teal hover:underline"><Icon.arrow width={14} height={14} className="rotate-180" /> {t.news}</Link>
          <div className="mt-6 flex items-center gap-3 text-sm text-ink-400"><span className="rounded-full bg-sand px-2.5 py-0.5 font-semibold text-navy">{n.market}</span><span>{t.inThisArticle} {formatDate(n.publishedOn, l)}</span></div>
          <h1 className="h-display mt-4 text-3xl leading-[1.1] md:text-5xl">{n.title}</h1>
          {n.excerpt && <p className="mt-5 text-xl leading-relaxed text-ink-600">{n.excerpt}</p>}
        </div>
        {img && <img src={img} alt="" className="mx-auto mt-10 aspect-[2/1] w-full max-w-5xl rounded-3xl object-cover shadow-card" />}
        <div className="mx-auto mt-10 max-w-3xl">
          <RichText content={n.body} className="text-lg text-ink-600" />
        </div>
      </article>
      {more.length > 0 && (
        <section className="wrap border-t border-line py-14">
          <h2 className="h-display text-2xl">{t.latestNews}</h2>
          <div className="mt-6 grid gap-8 md:grid-cols-3">{more.map((x: any) => <NewsCard key={x.documentId} n={x} locale={l} />)}</div>
        </section>
      )}
    </>
  );
}
