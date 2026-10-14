import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Blocks } from '@/components/blocks';
import { RichText } from '@/components/rich-text';
import type { Locale } from '@/i18n.config';
import { getProduct } from '@/lib/content';
import { dict } from '@/lib/i18n';

export async function generateMetadata({ params }: PageProps<'/[locale]/products/[slug]'>) {
  const { locale, slug } = await params;
  const p = await getProduct(locale as Locale, slug);
  return { title: p?.seo?.metaTitle || p?.name || 'Product', description: p?.seo?.metaDescription };
}

export default async function Product({ params }: PageProps<'/[locale]/products/[slug]'>) {
  const { locale, slug } = await params;
  const l = locale as Locale;
  const p = await getProduct(l, slug);
  if (!p) notFound();
  const t = dict(l);
  return (
    <>
      <Blocks blocks={p.blocks} ctx={{ locale: l, faqs: p.faqs, documents: p.documents, heroImage: p.heroImage }} />
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-xl border border-ink/10 bg-sand/40 p-6">
          {typeof p.localRate === 'number' && p.localRate > 0 && <div className="text-2xl font-bold text-navy">{t.rate}: {p.localRate}%</div>}
          {p.rateWording && <p className="mt-1 text-sm text-ink/80">{p.rateWording}</p>}
          <RichText content={p.legalDisclaimer} className="mt-4 text-xs text-ink/60" />
        </div>
        <Link href={`/${l}/products`} className="mt-6 inline-block text-sm text-teal underline">← {t.allProducts}</Link>
      </section>
    </>
  );
}
