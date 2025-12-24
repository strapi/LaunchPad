export const i18n = {
  defaultLocale: 'fr',
  locales: ['en', 'fr'],
} as const;

export type Locale = (typeof i18n)['locales'][number];
