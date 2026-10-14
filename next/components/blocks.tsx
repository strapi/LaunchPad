import Link from 'next/link';

import { Cta } from './cta';
import { RichText } from './rich-text';
import { mediaUrl } from '@/lib/config';
import { dict } from '@/lib/i18n';
import type { Locale } from '@/i18n.config';

type Ctx = { locale: Locale; faqs?: any[]; documents?: any[]; heroImage?: any };

export function Blocks({ blocks, ctx }: { blocks?: any[]; ctx: Ctx }) {
  if (!blocks?.length) return null;
  return <>{blocks.map((b, i) => <Block key={`${b.__component}-${b.id ?? i}`} block={b} ctx={ctx} />)}</>;
}

function Block({ block, ctx }: { block: any; ctx: Ctx }) {
  const t = dict(ctx.locale);
  switch (block.__component) {
    case 'blocks.hero': {
      const img = mediaUrl(block.image) || mediaUrl(ctx.heroImage);
      return (
        <section className="bg-navy text-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2 md:items-center">
            <div>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">{block.title}</h1>
              {block.subtitle && <p className="mt-4 text-lg text-white/80">{block.subtitle}</p>}
              <div className="mt-8"><Cta cta={block.cta} locale={ctx.locale} /></div>
            </div>
            {img && <img src={img} alt="" className="h-64 w-full rounded-xl object-cover md:h-80" />}
          </div>
        </section>
      );
    }
    case 'blocks.coverage-table':
      return (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-bold text-navy">{block.title}</h2>
          <div className="mt-6 overflow-hidden rounded-xl border border-ink/10">
            {(block.rows || []).map((r: any) => (
              <div key={r.id ?? r.name} className="grid grid-cols-[auto_1fr_1fr] items-center gap-4 border-b border-ink/10 px-4 py-3 last:border-0">
                <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${r.included ? 'bg-teal text-white' : 'bg-ink/10 text-ink/50'}`}>{r.included ? '✓' : '–'}</span>
                <span className="font-medium">{r.name}</span>
                <span className="text-sm text-ink/60">{r.note}</span>
              </div>
            ))}
          </div>
        </section>
      );
    case 'blocks.document-list':
      return (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-bold text-navy">{block.title}</h2>
          {block.intro && <p className="mt-2 text-ink/70">{block.intro}</p>}
          <ul className="mt-6 grid gap-3 md:grid-cols-3">
            {(ctx.documents || []).map((d: any) => (
              <li key={d.documentId} className="rounded-lg border border-ink/10 p-4">
                <div className="text-xs uppercase tracking-wide text-teal">{d.market} · {d.regulatoryReference}</div>
                <div className="mt-1 font-medium">{d.title}</div>
                {mediaUrl(d.file) && <a className="mt-2 inline-block text-sm text-navy underline" href={mediaUrl(d.file)!} target="_blank" rel="noreferrer">{t.download}</a>}
              </li>
            ))}
            {!(ctx.documents || []).length && <li className="text-sm text-ink/50">–</li>}
          </ul>
        </section>
      );
    case 'blocks.faq-list':
      return (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-bold text-navy">{block.title}</h2>
          <div className="mt-6 divide-y divide-ink/10 rounded-xl border border-ink/10">
            {(ctx.faqs || []).map((f: any) => (
              <details key={f.documentId} className="group px-4 py-3">
                <summary className="cursor-pointer font-medium">{f.question}</summary>
                <RichText content={f.answer} className="mt-2 text-sm text-ink/70" />
              </details>
            ))}
          </div>
        </section>
      );
    case 'blocks.rich-text':
      return (
        <section className="mx-auto max-w-3xl px-4 py-12">
          {block.title && <h2 className="mb-4 text-2xl font-bold text-navy">{block.title}</h2>}
          <RichText content={block.body} className="text-lg leading-relaxed text-ink/80" />
        </section>
      );
    case 'blocks.stats':
      return (
        <section className="bg-sand">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
            {(block.items || []).map((s: any) => (
              <div key={s.id ?? s.label}>
                <div className="text-3xl font-bold text-navy">{s.value}</div>
                <div className="text-sm text-ink/70">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      );
    case 'blocks.cta-band':
      return (
        <section className="bg-teal text-white">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-12 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">{block.title}</h2>
              {block.text && <p className="mt-1 text-white/85">{block.text}</p>}
            </div>
            <Cta cta={block.cta ? { ...block.cta, variant: 'secondary' } : null} locale={ctx.locale} />
          </div>
        </section>
      );
    default:
      return null;
  }
}

export function ProductCard({ p, locale }: { p: any; locale: Locale }) {
  const t = dict(locale);
  return (
    <Link href={`/${locale}/products/${p.slug}`} className="group rounded-xl border border-ink/10 bg-white p-5 transition hover:border-teal">
      {mediaUrl(p.heroImage) && <img src={mediaUrl(p.heroImage)!} alt="" className="mb-4 h-36 w-full rounded-lg object-cover" />}
      <div className="text-xs uppercase tracking-wide text-teal">{p.category}</div>
      <h3 className="mt-1 text-xl font-bold text-navy group-hover:underline">{p.name}</h3>
      <p className="mt-2 text-sm text-ink/70">{p.tagline}</p>
      {typeof p.localRate === 'number' && p.localRate > 0 && <p className="mt-3 text-sm font-semibold text-navy">{t.rate}: {p.localRate}%</p>}
    </Link>
  );
}
