import { createFileRoute } from '@tanstack/react-router';

import { clearDraftMode } from '@/lib/draft-mode';

/**
 * Exits draft mode.
 *
 * URL: GET /api/exit-preview
 *
 * Clears the `draft` cookie and returns a JSON success payload, matching
 * Next's `app/api/exit-preview/route.ts` response shape so the existing
 * `<DraftModeBanner>` component's exit button keeps working unchanged.
 */
export const Route = createFileRoute('/api/exit-preview')({
  server: {
    handlers: {
      GET: () => {
        clearDraftMode();
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        });
      },
    },
  },
});
