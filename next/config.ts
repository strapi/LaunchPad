import { Pathnames, LocalePrefix } from "next-intl/routing";

export const defaultLocale = "en" as const;
export const locales = ["en", "fr"] as const;

export type Locale = (typeof locales)[number];

export const pathnames: Pathnames<typeof locales> = {};

export const localePrefix: LocalePrefix<typeof locales> = "always";

export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_URL
  ? `https://${process.env.WEBSITE_URL}`
  : `http://localhost:${port}`;
