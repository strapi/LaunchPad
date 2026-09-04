import { useMatches, useRouter } from '@tanstack/react-router';

import { i18n } from '@/i18n.config';
import { cn } from '@/lib/utils';

/**
 * Reads `localizedSlugs` from the deepest matched route's loaderData.
 *
 * Each page route (`$locale/index`, `$locale/$slug`, etc.) returns
 * `{ localizedSlugs: Record<locale, slug> }` from its loader. This walks
 * matches deepest-first and returns the first one that exposes the map,
 * mirroring Next's `SlugContext` pattern without the React context.
 */
function useLocalizedSlugs(): Record<string, string> | null {
  const matches = useMatches();
  for (let i = matches.length - 1; i >= 0; i--) {
    const data = matches[i].loaderData as
      | { localizedSlugs?: Record<string, string> }
      | undefined;
    if (data && data.localizedSlugs) {
      return data.localizedSlugs;
    }
  }
  return null;
}

/**
 * Locale toggle. When the current route exposes `localizedSlugs`, navigates
 * to the localized slug for the target locale. Otherwise falls back to just
 * swapping the locale segment in the current pathname.
 */
export function LocaleSwitcher({ currentLocale }: { currentLocale: string }) {
  const router = useRouter();
  const localizedSlugs = useLocalizedSlugs();

  const buildTargetPath = (targetLocale: string): string => {
    if (localizedSlugs) {
      const slug = localizedSlugs[targetLocale];
      if (slug === undefined) {
        // No localization for this route → send to the target locale's home.
        return `/${targetLocale}`;
      }
      return slug === '' ? `/${targetLocale}` : `/${targetLocale}/${slug}`;
    }

    // Fallback: swap the locale segment in the current pathname.
    const segments = router.state.location.pathname.split('/');
    if (segments.length < 2) return `/${targetLocale}`;
    segments[1] = targetLocale;
    return segments.join('/') || `/${targetLocale}`;
  };

  const handleClick = (targetLocale: string) => {
    router.navigate({ to: buildTargetPath(targetLocale) as any });
  };

  return (
    <div className="flex gap-2 p-1 rounded-md">
      {i18n.locales.map((locale) => (
        <button
          type="button"
          key={locale}
          onClick={() => handleClick(locale)}
          className={cn(
            'flex cursor-pointer items-center justify-center text-sm leading-[110%] w-8 py-1 rounded-md hover:bg-neutral-800 hover:text-white/80 text-white hover:shadow-[0px_1px_0px_0px_var(--neutral-600)_inset] transition duration-200',
            locale === currentLocale
              ? 'bg-neutral-800 text-white shadow-[0px_1px_0px_0px_var(--neutral-600)_inset]'
              : ''
          )}
        >
          {locale}
        </button>
      ))}
    </div>
  );
}
