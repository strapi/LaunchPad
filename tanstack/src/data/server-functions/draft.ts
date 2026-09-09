import { createServerFn } from '@tanstack/react-start';

import { isDraftMode } from '@/lib/draft-mode';

/**
 * Reads the `draft` cookie server-side and returns whether draft mode is
 * currently enabled. Called from loaders that want to conditionally render
 * the DraftModeBanner.
 *
 * Wrapped in `createServerFn` because `isDraftMode()` uses h3's event
 * context (`getCookie`), which is only populated during a server request.
 */
export const getDraftMode = createServerFn({ method: 'GET' }).handler(() => {
  return { isDraftMode: isDraftMode() };
});
