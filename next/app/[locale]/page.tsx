import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Blocks, NewsCard, ProductCard } from '@/components/blocks';
import { Icon } from '@/components/icons';
import type { Locale } from '@/i18n.config';
import { getNews, getPage, getProducts } from '@/lib/content';
import { dict } from '@/lib/i18n';

export default async function Home({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  const l = locale as Locale;
  const [page, products, news] = await Promise.all([getPage(l, 'home'), getProducts(l), getNews(l)]);
  if (!page) notFound();
  const t = dict(l);
  const blocks: any[] = page.blocks || [];
  const hero = blocks.find((b) => b.__component === 'blocks.hero');
  const stats = blocks.find((b) => b.__component === 'blocks.stats');
  const rest = blocks.filter((b) => b !== hero && b !== stats);
  const ctx = { locale: l, faqs: page.faqs, products, variant: 'home' as const };
  return (
    <>
      <Blocks blocks={hero ? [hero] : []} ctx={ctx} />
      <Blocks blocks={stats ? [stats] : []} ctx={ctx} />

      <section className="wrap py-16 md:py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="eyebrow">{t.products}</div>
            <h2 className="h-display mt-2 text-3xl md:text-4xl">{t.ourCover}</h2>
            <p className="mt-3 text-lg text-ink-600">{t.ourCoverIntro}</p>
          </div>
          <Link href={`/${l}/products`} className="btn-outline">{t.allProducts} <Icon.arrow width={16} height={16} /></Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((p: any) => <ProductCard key={p.documentId} p={p} locale={l} />)}
        </div>
      </section>

      <Blocks blocks={rest.filter((b) => b.__component !== 'blocks.cta-band')} ctx={ctx} />

      {news.length > 0 && (
        <section className="wrap py-16 md:py-20">
          <div className="flex items-end justify-between">
            <div>
              <div className="eyebrow">{t.news}</div>
              <h2 className="h-display mt-2 text-3xl md:text-4xl">{t.latestNews}</h2>
            </div>
            <Link href={`/${l}/news`} className="btn-ghost hidden md:inline-flex">{t.allNews} <Icon.arrow width={16} height={16} /></Link>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {news.slice(0, 3).map((n: any) => <NewsCard key={n.documentId} n={n} locale={l} />)}
          </div>
        </section>
      )}

      <Blocks blocks={rest.filter((b) => b.__component === 'blocks.cta-band')} ctx={ctx} />
    </>
  );
}
