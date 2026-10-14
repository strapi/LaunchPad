import { ProductCard } from '@/components/blocks';
import type { Locale } from '@/i18n.config';
import { getProducts } from '@/lib/content';
import { dict } from '@/lib/i18n';

export default async function Products({ params }: PageProps<'/[locale]/products'>) {
  const { locale } = await params;
  const l = locale as Locale;
  const products = await getProducts(l);
  const t = dict(l);
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-navy">{t.allProducts}</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p: any) => <ProductCard key={p.documentId} p={p} locale={l} />)}
      </div>
    </section>
  );
}
