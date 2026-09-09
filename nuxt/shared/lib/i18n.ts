/**
 * Locale configuration.
 *
 * LaunchPad ships `en` and `fr`. Routing is plain Nuxt file routes under a
 * `[locale]` segment rather than `@nuxtjs/i18n`: all the translated content
 * comes from Strapi, keyed by locale, so there are no UI message catalogues
 * for an i18n module to manage. What is left is the routing and the locale
 * param, which is what this file covers.
 */

export const LOCALES = ['en', 'fr'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

/** `Intl` tags for the two locales, used for dates and currency. */
export const intlTag = (locale: string): string =>
  locale === 'fr' ? 'fr-FR' : 'en-US';

export function formatDate(
  value: string | null | undefined,
  locale: string
): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(intlTag(locale), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatPrice(
  value: number | null | undefined,
  locale: string
): string | null {
  if (value === null || value === undefined) return null;
  return new Intl.NumberFormat(intlTag(locale), {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Builds the `localizedPaths` map LocaleSwitcher expects, from Strapi's
 * `localizations` array.
 *
 * `prefix` is whatever sits between the locale and the slug — `blog` for
 * articles, `products` for products, empty for pages. The current locale is
 * seeded from `slug` because Strapi omits the entry's own locale from its
 * `localizations` list.
 */
export function localizedPaths(
  currentLocale: string,
  slug: string,
  localizations: Array<{ locale: string; slug: string }> | undefined,
  prefix = ''
): Record<string, string> {
  const withPrefix = (value: string) => (prefix ? `${prefix}/${value}` : value);

  return (localizations ?? []).reduce<Record<string, string>>(
    (acc, localization) => {
      acc[localization.locale] = withPrefix(localization.slug);
      return acc;
    },
    { [currentLocale]: withPrefix(slug) }
  );
}
