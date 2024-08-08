import createMiddleware from "next-intl/middleware";
import { localePrefix, defaultLocale, locales } from "./config";
import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const intlMiddleware = createMiddleware({
    defaultLocale,
    locales,
    localePrefix,
  });

  const response = intlMiddleware(request);

  if (response instanceof NextResponse) {
    response.headers.set("x-current-path", request.nextUrl.pathname);
  }

  return response;
}

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    "/",

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    "/(fr|en)/:path*",

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
