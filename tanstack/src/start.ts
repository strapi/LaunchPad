import { match as matchLocale } from '@formatjs/intl-localematcher';
import { createMiddleware, createStart } from '@tanstack/react-start';
import Negotiator from 'negotiator';

import { i18n } from '@/i18n.config';
import { resolveRedirect } from '@/lib/redirections';

/**
 * Detects the preferred locale from the request's Accept-Language header.
 * Ported from launchpad/next/proxy.ts.
 */
function getLocale(headers: Headers): string {
  const negotiatorHeaders: Record<string, string> = {};
  headers.forEach((value, key) => {
    negotiatorHeaders[key] = value;
  });

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const locales: ReadonlyArray<string> = i18n.locales;

  try {
    return matchLocale(languages, locales, i18n.defaultLocale);
  } catch {
    return i18n.defaultLocale;
  }
}

/**
 * Global request middleware.
 *
 * Redirects any request whose pathname does not start with a known locale to
 * the same path prefixed with the negotiated locale. Replaces Next's
 * `proxy.ts` + Next `config.matcher`.
 *
 * Skips: static assets, framework internals, and _server function calls.
 */
const localeRedirectMiddleware = createMiddleware({
  type: 'request',
}).server(async ({ next, request }) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Pass-through: framework internals, static files, server function RPC
  const isInternal =
    pathname.startsWith('/_') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/favicon') ||
    /\.[a-zA-Z0-9]+$/.test(pathname); // any /foo.ext path

  if (isInternal) {
    return next();
  }

  const matchedLocale = i18n.locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (matchedLocale) {
    // Already locale-prefixed — check the editor-managed redirects in Strapi
    // before letting the request through to the router.
    const rest = pathname.slice(`/${matchedLocale}`.length) || '/';
    const destination = await resolveRedirect(matchedLocale, rest);

    if (destination) {
      return new Response(null, {
        status: 307,
        headers: { Location: `${destination}${url.search}` },
      });
    }

    return next();
  }

  const locale = getLocale(request.headers);
  const redirectPath = `/${locale}${pathname === '/' ? '' : pathname}${url.search}`;

  return new Response(null, {
    status: 307,
    headers: {
      Location: redirectPath,
    },
  });
});

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [localeRedirectMiddleware],
  };
});
