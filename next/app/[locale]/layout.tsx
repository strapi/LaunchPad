import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';

import { DraftBanner } from '@/components/draft-banner';
import { Preview } from '@/components/preview';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { i18n, type Locale } from '@/i18n.config';
import { getFooter, getGlobal, getHeader, getPromoBanner } from '@/lib/content';
import { dict } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!(i18n.locales as readonly string[]).includes(locale)) notFound();
  const l = locale as Locale;
  const [global, header, footer, banner] = await Promise.all([getGlobal(l), getHeader(l), getFooter(l), getPromoBanner(l)]);
  const { isEnabled } = await draftMode();
  const t = dict(l);
  return (
    <div lang={l} className="flex min-h-screen flex-col">
      <Preview />
      <SiteHeader locale={l} global={global} header={header} banner={banner} />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={l} global={global} footer={footer} />
      {isEnabled && <DraftBanner label={t.draft} exit={t.exitDraft} />}
    </div>
  );
}
