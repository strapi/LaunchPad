import { Outlet, createFileRoute, notFound } from '@tanstack/react-router';

import { Banner } from '@/components/banner';
import { DraftModeBanner } from '@/components/draft-mode-banner';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { NotFound } from '@/components/not-found';
import { AIToast } from '@/components/toast';
import { CartProvider } from '@/context/cart-context';
import { isDemoServerFunction } from '@/data/server-functions/demo';
import { isLocale } from '@/i18n.config';
import { buildSeoMeta } from '@/lib/shared/metadata';

/**
 * Locale-scoped layout route.
 *
 * Validates the `$locale` param and parallel-fetches:
 *   1. `global` single type (navbar / footer data)
 *   2. `currentUser` via `getAuthServerFunction` (HttpOnly session cookie)
 *   3. `isDraftMode` via `getDraftMode` (HttpOnly `draft` cookie)
 *
 * When `isDraftMode` is true, content server functions (page, article,
 * product) request draft data from Strapi (`status: 'draft'`), AND the
 * `<DraftModeBanner>` is mounted so the author can exit preview mode.
 */
export const Route = createFileRoute('/$locale')({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale)) {
      throw notFound();
    }
  },
  loader: async ({ params, context }) => {
    const [globalData, currentUser, draft, isDemo] = await Promise.all([
      context.strapiApi.global.getGlobalData({
        data: { locale: params.locale },
      }),
      context.strapiApi.auth.getAuthServerFunction(),
      context.strapiApi.draft.getDraftMode(),
      isDemoServerFunction(),
    ]);
    return {
      global: globalData.data,
      locale: params.locale,
      currentUser,
      isDraftMode: draft.isDraftMode,
      isDemo,
    };
  },
  // Default SEO for every page under this locale. Pages with their own `seo`
  // component override this in their route's own `head()`; pages without one
  // inherit the `global` single type's SEO instead of falling back to the
  // hardcoded root title. Mirrors Next's locale-layout `generateMetadata`.
  head: ({ loaderData }) => ({
    meta: buildSeoMeta(loaderData?.global?.seo),
  }),
  component: LocaleLayout,
  notFoundComponent: () => (
    <NotFound
      title="Page not found"
      message="We couldn't find what you're looking for."
    />
  ),
});

function LocaleLayout() {
  const { global, locale, currentUser, isDraftMode, isDemo } =
    Route.useLoaderData();
  return (
    <CartProvider>
      <div className="bg-charcoal antialiased h-full w-full">
        {isDemo && <Banner />}
        <Navbar
          data={global?.navbar}
          locale={locale}
          hasBanner={isDemo}
          currentUser={currentUser}
        />
        <Outlet />
        <Footer data={global?.footer} locale={locale} />
        <AIToast />
        {isDraftMode && <DraftModeBanner />}
      </div>
    </CartProvider>
  );
}
