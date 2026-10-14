import { notFound } from 'next/navigation';

import { Blocks, ProductCard } from '@/components/blocks';
import type { Locale } from '@/i18n.config';
import { getPage, getProducts } from '@/lib/content';
import { dict } from '@/lib/i18n';

export default async function Home({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  const l = locale as Locale;
  const [page, products] = await Promise.all([getPage(l, 'home'), getProducts(l)]);
  if (!page) notFound();
  const t = dict(l);
  const [hero, ...rest] = page.blocks || [];
  return (
    <>
      <Blocks blocks={hero ? [hero] : []} ctx={{ locale: l, faqs: page.faqs }} />
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold text-navy">{t.products}</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p: any) => <ProductCard key={p.documentId} p={p} locale={l} />)}
        </div>
      </section>
      <Blocks blocks={rest} ctx={{ locale: l, faqs: page.faqs }} />
    </>
  );
}
