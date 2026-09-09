/**
 * Locale configuration, mirroring `astro.config.mjs`.
 *
 * Astro's i18n config is not importable at runtime, so the list lives here and
 * both places reference the same two values. LaunchPad ships `en` and `fr`.
 */

export const LOCALES = ['en', 'fr'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
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
