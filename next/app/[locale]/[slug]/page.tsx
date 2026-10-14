import Link from 'next/link';

import { Blocks } from '@/components/blocks';
import type { Locale } from '@/i18n.config';
import { getPage } from '@/lib/content';
import { dict } from '@/lib/i18n';

export default async function Page({ params }: PageProps<'/[locale]/[slug]'>) {
  const { locale, slug } = await params;
  const l = locale as Locale;
  const page = await getPage(l, slug);
  const t = dict(l);
  if (!page) {
    // Routes like /quote, /account or /careers exist in the navigation but are out of the demo's scope.
    return (
      <section className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-navy">/{slug}</h1>
        <p className="mt-3 text-ink/60">{t.demo}</p>
        <Link href={`/${l}`} className="mt-6 inline-block text-sm text-teal underline">← {t.back}</Link>
      </section>
    );
  }
  return <Blocks blocks={page.blocks} ctx={{ locale: l, faqs: page.faqs }} />;
}
