export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'fr', 'de', 'it'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

export const localeLabels: Record<Locale, string> = { en: 'EN', fr: 'FR', de: 'DE', it: 'IT' };
export const localeMarket: Record<Locale, 'group' | 'FR' | 'DE' | 'IT'> = { en: 'group', fr: 'FR', de: 'DE', it: 'IT' };
