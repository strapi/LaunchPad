import { createRouter as createTanstackRouter } from '@tanstack/react-router';

import { routeTree } from './routeTree.gen';
import { strapiApi } from '@/data/server-functions';

export function getRouter() {
  return createTanstackRouter({
    routeTree,
    context: {
      strapiApi,
    },
    scrollRestoration: true,
    scrollToTopSelectors: ['#main-content'],
    defaultPreloadStaleTime: 0,
  });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
