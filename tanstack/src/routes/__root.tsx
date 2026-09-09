import { TanStackDevtools } from '@tanstack/react-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

import { Preview } from '@/components/preview';
import type { strapiApi } from '@/data/server-functions';
import globalCss from '@/global.css?url';
import { i18n, isLocale } from '@/i18n.config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

export const Route = createRootRouteWithContext<{
  strapiApi: typeof strapiApi;
}>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Tanpad' },
    ],
    links: [
      { rel: 'stylesheet', href: globalCss },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap',
      },
    ],
  }),

  shellComponent: RootDocument,
});

/**
 * Reads the locale out of the current pathname (`/en/blog/...` -> `en`) so
 * <html lang> reflects the page being served. The shell renders above the
 * `$locale` route, so its params aren't reachable from here.
 */
function useDocumentLang(): string {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const segment = pathname.split('/')[1];
  return isLocale(segment) ? segment : i18n.defaultLocale;
}

function RootDocument({ children }: Readonly<{ children: React.ReactNode }>) {
  const lang = useDocumentLang();

  return (
    <html lang={lang}>
      <head>
        <HeadContent />
      </head>
      <body className="bg-charcoal antialiased h-full w-full">
        <QueryClientProvider client={queryClient}>
          <Preview />
          <main id="main-content">{children}</main>
          {process.env.NODE_ENV !== 'production' && (
            <TanStackDevtools
              config={{ position: 'bottom-left' }}
              plugins={[
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
              ]}
            />
          )}
          <Scripts />
        </QueryClientProvider>
      </body>
    </html>
  );
}
