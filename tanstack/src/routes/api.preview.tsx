import { createFileRoute } from '@tanstack/react-router';

import { clearDraftMode, setDraftMode } from '@/lib/draft-mode';

/**
 * Preview / draft-mode entry point.
 *
 * URL: GET /api/preview?secret=<PREVIEW_SECRET>&url=<redirect-target>&status=<draft|published>
 *
 * Mirrors Next's `app/api/preview/route.ts` contract so existing Strapi
 * admin preview URL templates can be copy-pasted with just the domain
 * swapped.
 *
 *   - `secret`  required. Validated against `process.env.PREVIEW_SECRET`.
 *                Returns 401 on mismatch.
 *   - `url`     optional. Where to redirect after enabling/disabling
 *                draft mode. Defaults to '/'.
 *   - `status`  optional. When `published`, DISABLES draft mode (useful
 *                for an admin "exit preview and view live" button).
 *                Any other value (default) ENABLES draft mode.
 *
 * Cookie: writes / clears the HttpOnly `draft` cookie via
 * `setDraftMode()` / `clearDraftMode()` from `@/lib/draft-mode`.
 *
 * Strapi admin configuration:
 *   Content-Type Builder → Draft & Publish → Preview URL template:
 *     http://localhost:3000/api/preview?secret=<secret>&url=/{locale}/{slug}
 */
export const Route = createFileRoute('/api/preview')({
  server: {
    handlers: {
      GET: ({ request }) => {
        const { searchParams } = new URL(request.url);
        const secret = searchParams.get('secret');
        const url = searchParams.get('url') ?? '/';
        const status = searchParams.get('status');

        if (secret !== process.env.PREVIEW_SECRET) {
          return new Response('Invalid token', { status: 401 });
        }

        if (status === 'published') {
          clearDraftMode();
        } else {
          setDraftMode();
        }

        return new Response(null, {
          status: 307,
          headers: { Location: url },
        });
      },
    },
  },
});
