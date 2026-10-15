import Link from 'next/link';

import { Blocks } from '@/components/blocks';
import { Icon } from '@/components/icons';
import type { Locale } from '@/i18n.config';
import { getPage } from '@/lib/content';
import { dict } from '@/lib/i18n';

export default async function Page({ params }: PageProps<'/[locale]/[slug]'>) {
  const { locale, slug } = await params;
  const l = locale as Locale;
  const page = await getPage(l, slug);
  const t = dict(l);
  if (!page) {
    // Routes like /quote, /account or /careers exist in the navigation but are outside the demo's scope.
    return (
      <section className="wrap py-24">
        <div className="card mx-auto max-w-xl p-10 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-sand text-navy"><Icon.pin /></span>
          <h1 className="h-display mt-5 text-2xl">{t.outOfScope}</h1>
          <p className="mt-3 text-ink-600">{t.outOfScopeHint}</p>
          <code className="mt-4 inline-block rounded bg-sand px-2 py-1 text-xs text-ink-600">/{slug}</code>
          <div className="mt-8"><Link href={`/${l}`} className="btn-navy">{t.backHome} <Icon.arrow width={16} height={16} /></Link></div>
        </div>
      </section>
    );
  }
  return <Blocks blocks={page.blocks} ctx={{ locale: l, faqs: page.faqs, variant: 'page' }} />;
}
