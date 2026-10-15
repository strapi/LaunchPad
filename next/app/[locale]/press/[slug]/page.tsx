import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Icon } from '@/components/icons';
import { RichText } from '@/components/rich-text';
import type { Locale } from '@/i18n.config';
import { getPressRelease, getPressReleases } from '@/lib/content';
import { dict, formatDate } from '@/lib/i18n';

export default async function PressRelease({ params }: PageProps<'/[locale]/press/[slug]'>) {
  const { locale, slug } = await params;
  const l = locale as Locale;
  const [p, all] = await Promise.all([getPressRelease(slug), getPressReleases()]);
  if (!p) notFound();
  const t = dict(l);
  const others = all.filter((x: any) => x.slug !== slug).slice(0, 5);
  return (
    <article className="wrap grid gap-12 py-12 md:py-16 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <Link href={`/${l}/news`} className="inline-flex items-center gap-1 text-sm font-medium text-teal hover:underline"><Icon.arrow width={14} height={14} className="rotate-180" /> {t.news}</Link>
        <div className="mt-6 flex items-center gap-3 text-sm text-ink-400"><span className="rounded-full bg-navy px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-white">{t.press}</span><span>{formatDate(p.publishedOn, l)}</span></div>
        <h1 className="h-display mt-4 max-w-3xl text-3xl leading-[1.1] md:text-5xl">{p.title}</h1>
        <RichText content={p.body} className="mt-8 max-w-3xl text-lg text-ink-600" />
      </div>
      <aside className="lg:col-span-4">
        <div className="card sticky top-32 p-6">
          <div className="eyebrow">{t.pressKit}</div>
          <ul className="mt-3 divide-y divide-line">
            {others.map((x: any) => (
              <li key={x.documentId} className="py-3"><Link href={`/${l}/press/${x.slug}`} className="group block"><div className="text-xs text-ink-400">{formatDate(x.publishedOn, l)}</div><div className="mt-0.5 font-semibold leading-snug text-navy group-hover:underline">{x.title}</div></Link></li>
            ))}
          </ul>
        </div>
      </aside>
    </article>
  );
}
