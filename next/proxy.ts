import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { i18n } from '@/i18n.config';

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales: Readonly<string[]> = i18n.locales;
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  // Negotiator returns ['*'] when Accept-Language is missing, and matchLocale
  // throws on that or on any malformed tag.
  try {
    return matchLocale(languages, locales, i18n.defaultLocale);
  } catch {
    return i18n.defaultLocale;
  }
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    );
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
