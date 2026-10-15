import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Blocks, ProductCard } from '@/components/blocks';
import { Cta } from '@/components/cta';
import { CategoryIcon, Icon } from '@/components/icons';
import { RichText } from '@/components/rich-text';
import type { Locale } from '@/i18n.config';
import { mediaUrl } from '@/lib/config';
import { getProduct, getProducts } from '@/lib/content';
import { dict } from '@/lib/i18n';

export async function generateMetadata({ params }: PageProps<'/[locale]/products/[slug]'>) {
  const { locale, slug } = await params;
  const p = await getProduct(locale as Locale, slug);
  return { title: p?.seo?.metaTitle || p?.name || 'Product', description: p?.seo?.metaDescription };
}

export default async function Product({ params }: PageProps<'/[locale]/products/[slug]'>) {
  const { locale, slug } = await params;
  const l = locale as Locale;
  const [p, all] = await Promise.all([getProduct(l, slug), getProducts(l)]);
  if (!p) notFound();
  const t = dict(l);
  const blocks: any[] = p.blocks || [];
  const hero = blocks.find((b) => b.__component === 'blocks.hero');
  const rest = blocks.filter((b) => b !== hero);
  const img = mediaUrl(hero?.image) || mediaUrl(p.heroImage);
  const hasRate = typeof p.localRate === 'number' && p.localRate > 0;
  const related = all.filter((x: any) => x.category === p.category && x.slug !== p.slug).slice(0, 3);
  const docs: any[] = p.documents || [];

  return (
    <>
      <section className="relative overflow-hidden bg-navy text-white">
        {img && <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />}
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/30" />
        <div className="wrap relative grid gap-10 py-14 md:py-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <nav className="flex items-center gap-2 text-sm text-white/60">
              <Link href={`/${l}`} className="hover:text-white">Meridian</Link><span>/</span>
              <Link href={`/${l}/products`} className="hover:text-white">{t.products}</Link><span>/</span>
              <span className="text-white/90">{p.name}</span>
            </nav>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <CategoryIcon category={p.category} width={14} height={14} /> {(t.category as any)[p.category] ?? p.category}
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-[-0.02em] md:text-5xl lg:text-6xl">{hero?.title || p.name}</h1>
            {(hero?.subtitle || p.tagline) && <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl">{hero?.subtitle || p.tagline}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <Cta cta={hero?.cta} locale={l} />
              <a href="#coverage" className="btn border border-white/30 text-white hover:bg-white/10">{t.whatIsCovered}</a>
            </div>
          </div>
          <aside className="lg:col-span-5">
            <div className="card p-6 text-ink md:p-7">
              <div className="eyebrow">{t.priceAndTerms}</div>
              {hasRate && (
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-display text-5xl font-bold tracking-tight text-navy">{p.localRate}%</span>
                  <span className="text-sm text-ink-600">{t.rate}</span>
                </div>
              )}
              {p.rateWording && <p className="mt-3 text-[15px] leading-relaxed text-ink-600">{p.rateWording}</p>}
              {docs.length > 0 && (
                <div className="mt-5 border-t border-line pt-5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink-400">{t.documents}</div>
                  <ul className="mt-2 space-y-2">
                    {docs.slice(0, 3).map((d: any) => (
                      <li key={d.documentId}>
                        <a href={mediaUrl(d.file) || '#documents'} target={mediaUrl(d.file) ? '_blank' : undefined} rel="noreferrer" className="group flex items-center gap-3 text-sm">
                          <Icon.doc width={18} height={18} className="shrink-0 text-teal" />
                          <span className="flex-1 text-navy group-hover:underline">{d.title}</span>
                          <span className="rounded bg-sand px-1.5 py-0.5 text-[11px] font-semibold text-ink-600">{d.market}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <RichText content={p.legalDisclaimer} className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-ink-400" />
            </div>
          </aside>
        </div>
      </section>

      <Blocks blocks={rest} ctx={{ locale: l, faqs: p.faqs, documents: docs, heroImage: p.heroImage }} />

      {related.length > 0 && (
        <section className="wrap py-16">
          <h2 className="h-display text-2xl">{t.relatedProducts}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((x: any) => <ProductCard key={x.documentId} p={x} locale={l} />)}
          </div>
        </section>
      )}
    </>
  );
}
