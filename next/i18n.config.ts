export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'fr', 'fa']
} as const

export type Locale = (typeof i18n)['locales'][number]