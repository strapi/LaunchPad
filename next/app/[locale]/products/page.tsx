import { ProductCard } from '@/components/blocks';
import { CategoryIcon } from '@/components/icons';
import type { Locale } from '@/i18n.config';
import { getProducts } from '@/lib/content';
import { dict } from '@/lib/i18n';

export default async function Products({ params }: PageProps<'/[locale]/products'>) {
  const { locale } = await params;
  const l = locale as Locale;
  const products = await getProducts(l);
  const t = dict(l);
  const cats = Array.from(new Set(products.map((p: any) => p.category).filter(Boolean))) as string[];
  return (
    <>
      <section className="bg-sand">
        <div className="wrap py-14 md:py-20">
          <div className="eyebrow">{t.products}</div>
          <h1 className="h-display mt-2 text-4xl md:text-5xl">{t.allProducts}</h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-600">{t.ourCoverIntro}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {cats.map((c) => (
              <a key={c} href={`#${c}`} className="inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white px-4 py-2 text-sm font-medium text-navy hover:border-navy">
                <CategoryIcon category={c} width={16} height={16} className="text-teal" /> {(t.category as any)[c] ?? c}
              </a>
            ))}
          </div>
        </div>
      </section>
      <section className="wrap py-14">
        {cats.map((c) => (
          <div key={c} id={c} className="scroll-mt-28 py-6">
            <h2 className="h-display flex items-center gap-3 text-2xl"><span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal"><CategoryIcon category={c} /></span>{(t.category as any)[c] ?? c}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.filter((p: any) => p.category === c).map((p: any) => <ProductCard key={p.documentId} p={p} locale={l} />)}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
