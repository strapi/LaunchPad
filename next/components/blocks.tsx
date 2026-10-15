import Link from 'next/link';

import { Cta } from './cta';
import { CategoryIcon, Icon } from './icons';
import { RichText } from './rich-text';
import { mediaUrl } from '@/lib/config';
import { dict } from '@/lib/i18n';
import type { Locale } from '@/i18n.config';

export type Ctx = { locale: Locale; faqs?: any[]; documents?: any[]; heroImage?: any; products?: any[]; variant?: 'home' | 'page' };

export function Blocks({ blocks, ctx }: { blocks?: any[]; ctx: Ctx }) {
  if (!blocks?.length) return null;
  return <>{blocks.map((b, i) => <Block key={`${b.__component}-${b.id ?? i}`} block={b} ctx={ctx} />)}</>;
}

function Block({ block, ctx }: { block: any; ctx: Ctx }) {
  switch (block.__component) {
    case 'blocks.hero': return ctx.variant === 'home' ? <HomeHero block={block} ctx={ctx} /> : <PageHero block={block} ctx={ctx} />;
    case 'blocks.stats': return <Stats block={block} />;
    case 'blocks.rich-text': return <Prose block={block} />;
    case 'blocks.steps': return <Steps block={block} ctx={ctx} />;
    case 'blocks.faq-list': return <Faq block={block} ctx={ctx} />;
    case 'blocks.coverage-table': return <Coverage block={block} ctx={ctx} />;
    case 'blocks.document-list': return <Documents block={block} ctx={ctx} />;
    case 'blocks.cta-band': return <CtaBand block={block} ctx={ctx} />;
    default: return null;
  }
}

// ------------------------------------------------------------------ heroes

function HomeHero({ block, ctx }: { block: any; ctx: Ctx }) {
  const t = dict(ctx.locale);
  const img = mediaUrl(block.image) || mediaUrl(ctx.heroImage);
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sand via-white to-teal-50">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-teal-100/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 left-1/3 h-[420px] w-[420px] rounded-full bg-amber/20 blur-3xl" />
      <div className="wrap relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h1 className="h-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">{block.title}</h1>
          {block.subtitle && <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600 md:text-xl">{block.subtitle}</p>}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Cta cta={block.cta} locale={ctx.locale} />
            <Link href={`/${ctx.locale}/contact`} className="btn-ghost">{t.talkToAgent} <Icon.arrow width={16} height={16} /></Link>
          </div>
          {img && <img src={img} alt="" className="mt-10 hidden h-56 w-full rounded-2xl object-cover shadow-card lg:block" />}
        </div>
        <div className="lg:col-span-5">
          <QuoteCard products={ctx.products || []} locale={ctx.locale} />
        </div>
      </div>
    </section>
  );
}

function PageHero({ block, ctx }: { block: any; ctx: Ctx }) {
  const img = mediaUrl(block.image) || mediaUrl(ctx.heroImage);
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      {img && <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />}
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/40" />
      <div className="wrap relative py-16 md:py-24">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-[-0.02em] md:text-5xl">{block.title}</h1>
          {block.subtitle && <p className="mt-5 text-lg leading-relaxed text-white/80">{block.subtitle}</p>}
          {block.cta?.label && <div className="mt-8"><Cta cta={block.cta} locale={ctx.locale} onDark /></div>}
        </div>
      </div>
    </section>
  );
}

export function QuoteCard({ products, locale }: { products: any[]; locale: Locale }) {
  const t = dict(locale);
  const cats = Array.from(new Set(products.map((p) => p.category).filter(Boolean))) as string[];
  return (
    <div className="card p-6 md:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-display text-xl font-bold text-navy">{t.quoteTitle}</div>
          <p className="mt-1 text-sm text-ink-600">{t.quoteHint}</p>
        </div>
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal"><Icon.clock /></span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {cats.slice(0, 6).map((c) => {
          const first = products.find((p) => p.category === c);
          return (
            <Link key={c} href={`/${locale}/products/${first?.slug ?? ''}`} className="group flex flex-col items-center gap-2 rounded-xl border border-line px-2 py-3 text-center text-sm font-medium text-navy transition hover:border-teal hover:bg-teal-50">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sand text-navy transition group-hover:bg-teal group-hover:text-white"><CategoryIcon category={c} /></span>
              {(t.category as any)[c] ?? c}
            </Link>
          );
        })}
      </div>
      <Link href={`/${locale}/quote`} className="btn-primary mt-5 w-full">{t.quoteButton} <Icon.arrow width={16} height={16} /></Link>
    </div>
  );
}

// ------------------------------------------------------------------ sections

function Stats({ block }: { block: any }) {
  return (
    <section className="border-y border-line bg-white">
      <div className="wrap grid grid-cols-2 divide-line py-8 md:grid-cols-4 md:divide-x">
        {(block.items || []).map((s: any, i: number) => (
          <div key={s.id ?? i} className="px-2 py-3 md:px-8 md:first:pl-0">
            <div className="font-display text-3xl font-bold tracking-tight text-navy md:text-4xl">{s.value}</div>
            <div className="mt-1 text-sm text-ink-600">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Prose({ block }: { block: any }) {
  const img = mediaUrl(block.image);
  if (img) {
    return (
      <section className="wrap grid items-center gap-10 py-16 md:py-20 lg:grid-cols-2">
        <div className="relative">
          <img src={img} alt="" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lift" />
          <div className="absolute -bottom-5 -right-3 hidden h-24 w-24 rounded-2xl bg-amber/80 md:block" aria-hidden />
        </div>
        <div>
          {block.title && <h2 className="h-display text-3xl md:text-4xl">{block.title}</h2>}
          <RichText content={block.body} className="mt-5 text-lg text-ink-600" />
        </div>
      </section>
    );
  }
  return (
    <section className="wrap py-14 md:py-16">
      <div className="max-w-3xl">
        {block.title && <h2 className="h-display mb-5 text-3xl md:text-4xl">{block.title}</h2>}
        <RichText content={block.body} className="text-lg text-ink-600" />
      </div>
    </section>
  );
}

function Steps({ block, ctx }: { block: any; ctx: Ctx }) {
  const t = dict(ctx.locale);
  return (
    <section className="bg-sand">
      <div className="wrap py-16 md:py-20">
        <div className="max-w-2xl">
          {block.title && <h2 className="h-display text-3xl md:text-4xl">{block.title}</h2>}
          {block.intro && <p className="mt-3 text-lg text-ink-600">{block.intro}</p>}
        </div>
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {(block.items || []).map((s: any, i: number) => (
            <li key={s.id ?? i} className="card relative p-6">
              <div className="eyebrow">{t.step} {i + 1}</div>
              <div className="mt-2 font-display text-xl font-bold text-navy">{s.title}</div>
              {s.text && <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{s.text}</p>}
              <span className="absolute right-5 top-5 font-display text-5xl font-bold text-navy/5">{i + 1}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Faq({ block, ctx }: { block: any; ctx: Ctx }) {
  const faqs = ctx.faqs || [];
  if (!faqs.length) return null;
  return (
    <section className="wrap py-16 md:py-20">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="eyebrow">{dict(ctx.locale).faq}</div>
          <h2 className="h-display mt-2 text-3xl md:text-4xl">{block.title}</h2>
        </div>
        <div className="divide-y divide-line rounded-2xl border border-line lg:col-span-8">
          {faqs.map((f: any) => (
            <details key={f.documentId} className="group px-5 py-4 open:bg-sand/40">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-[17px] font-semibold text-navy">
                {f.question}
                <span className="chev inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy/5 text-navy transition"><Icon.chevron width={16} height={16} /></span>
              </summary>
              <RichText content={f.answer} className="mt-3 max-w-2xl text-[15px] text-ink-600" />
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Coverage({ block, ctx }: { block: any; ctx: Ctx }) {
  const t = dict(ctx.locale);
  const rows = block.rows || [];
  return (
    <section id="coverage" className="wrap py-14 md:py-16">
      <h2 className="h-display text-3xl">{block.title}</h2>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {rows.map((r: any) => (
          <div key={r.id ?? r.name} className={`flex items-start gap-4 rounded-2xl border p-4 ${r.included ? 'border-line bg-white' : 'border-dashed border-line bg-sand/50'}`}>
            <span className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${r.included ? 'bg-teal text-white' : 'bg-ink/10 text-ink-400'}`}>
              {r.included ? <Icon.check width={16} height={16} /> : <Icon.cross width={16} height={16} />}
            </span>
            <div>
              <div className={`font-semibold ${r.included ? 'text-navy' : 'text-ink-600'}`}>{r.name}</div>
              <div className="mt-0.5 text-sm text-ink-600">{r.note || (r.included ? t.included : t.notIncluded)}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Documents({ block, ctx }: { block: any; ctx: Ctx }) {
  const t = dict(ctx.locale);
  const docs = ctx.documents || [];
  return (
    <section id="documents" className="bg-sand">
      <div className="wrap py-14 md:py-16">
        <div className="max-w-2xl">
          <h2 className="h-display text-3xl">{block.title}</h2>
          {block.intro && <p className="mt-2 text-ink-600">{block.intro}</p>}
        </div>
        <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {docs.map((d: any) => <DocumentCard key={d.documentId} d={d} t={t} locale={ctx.locale} />)}
          {!docs.length && <li className="text-sm text-ink-400">–</li>}
        </ul>
      </div>
    </section>
  );
}

export function DocumentCard({ d, t, locale }: { d: any; t: any; locale: Locale }) {
  const href = mediaUrl(d.file);
  const Inner = (
    <>
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy text-white"><Icon.doc /></span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold uppercase tracking-wider text-teal">{d.market} · {d.regulatoryReference}</span>
        <span className="mt-1 block font-semibold leading-snug text-navy">{d.title}</span>
        <span className="mt-1 block text-xs text-ink-400">{d.validFrom ? `${t.validFrom} ${new Date(d.validFrom).toLocaleDateString(locale)}` : ''}{href ? ` · PDF` : ''}</span>
      </span>
    </>
  );
  return (
    <li>
      {href ? <a href={href} target="_blank" rel="noreferrer" className="card flex items-start gap-4 p-4 transition hover:-translate-y-0.5 hover:shadow-lift">{Inner}</a> : <div className="card flex items-start gap-4 p-4">{Inner}</div>}
    </li>
  );
}

function CtaBand({ block, ctx }: { block: any; ctx: Ctx }) {
  return (
    <section className="wrap py-10">
      <div className="relative overflow-hidden rounded-3xl bg-navy px-8 py-12 text-white md:px-14 md:py-16">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-amber/20 blur-3xl" />
        <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{block.title}</h2>
            {block.text && <p className="mt-3 text-lg text-white/80">{block.text}</p>}
          </div>
          <Cta cta={block.cta ? { ...block.cta, variant: block.cta.variant === 'outline' ? 'outline' : 'light' } : null} locale={ctx.locale} onDark />
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------ cards

export function ProductCard({ p, locale, featured = false }: { p: any; locale: Locale; featured?: boolean }) {
  const t = dict(locale);
  const img = mediaUrl(p.heroImage);
  const hasRate = typeof p.localRate === 'number' && p.localRate > 0;
  return (
    <Link href={`/${locale}/products/${p.slug}`} className={`card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lift ${featured ? 'md:col-span-2 md:flex-row' : ''}`}>
      <div className={`relative overflow-hidden ${featured ? 'md:w-1/2' : ''}`}>
        {img ? <img src={img} alt="" className={`w-full object-cover transition duration-500 group-hover:scale-[1.03] ${featured ? 'h-56 md:h-full' : 'h-44'}`} /> : <div className="h-44 bg-navy" />}
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy backdrop-blur">
          <CategoryIcon category={p.category} width={14} height={14} /> {(t.category as any)[p.category] ?? p.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-bold text-navy">{p.name}</h3>
        {p.hasIntroOffer && p.introOfferText && <span className="mt-2 inline-flex w-fit rounded-full bg-amber/30 px-2.5 py-0.5 text-xs font-semibold text-navy">{p.introOfferText}</span>}
        <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-600">{p.tagline}</p>
        <div className="mt-4 flex items-center justify-between">
          {hasRate ? <span className="text-sm text-ink-600">{t.rate} <span className="font-display text-lg font-bold text-navy">{p.localRate}%</span></span> : <span />}
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sand text-navy transition group-hover:bg-teal group-hover:text-white"><Icon.arrow width={16} height={16} /></span>
        </div>
      </div>
    </Link>
  );
}

export function NewsCard({ n, locale, big = false }: { n: any; locale: Locale; big?: boolean }) {
  const img = mediaUrl(n.cover);
  return (
    <Link href={`/${locale}/news/${n.slug}`} className={`group flex flex-col ${big ? 'md:col-span-2 md:flex-row md:gap-8' : ''}`}>
      <div className={`overflow-hidden rounded-2xl ${big ? 'md:w-3/5' : ''}`}>
        {img ? <img src={img} alt="" className={`w-full object-cover transition duration-500 group-hover:scale-[1.03] ${big ? 'h-64 md:h-full' : 'h-48'}`} /> : <div className="h-48 bg-sand" />}
      </div>
      <div className={`py-4 ${big ? 'md:w-2/5 md:py-2' : ''}`}>
        <div className="flex items-center gap-2 text-xs text-ink-400"><span className="rounded-full bg-sand px-2 py-0.5 font-semibold text-navy">{n.market}</span><span>{n.publishedOn}</span></div>
        <h3 className={`mt-2 font-display font-bold text-navy group-hover:underline ${big ? 'text-2xl md:text-3xl' : 'text-lg'}`}>{n.title}</h3>
        {n.excerpt && <p className={`mt-2 text-ink-600 ${big ? 'text-base' : 'line-clamp-2 text-sm'}`}>{n.excerpt}</p>}
      </div>
    </Link>
  );
}
