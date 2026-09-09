export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'fr'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

export function isLocale(value: string): value is Locale {
  return (i18n.locales as ReadonlyArray<string>).includes(value);
}
