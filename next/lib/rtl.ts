// RTL utility functions
export const RTL_LOCALES = ['fa', 'ar', 'he'] as const;

export function isRTLLocale(locale: string): boolean {
  return RTL_LOCALES.includes(locale as any);
}

export function getRTLClass(locale: string): string {
  return isRTLLocale(locale) ? 'rtl' : 'ltr';
}

export function getTextDirection(locale: string): 'rtl' | 'ltr' {
  return isRTLLocale(locale) ? 'rtl' : 'ltr';
}

// Utility to get appropriate margin/padding classes for RTL
export function getRTLAwareClass(locale: string, ltrClass: string, rtlClass: string): string {
  return isRTLLocale(locale) ? rtlClass : ltrClass;
}
