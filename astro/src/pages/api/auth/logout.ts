import type { APIRoute } from 'astro';

import { clearSession } from '@/lib/session';

/**
 * POST /api/auth/logout — clears the session cookie.
 *
 * POST rather than GET so it cannot be triggered by a stray <img> or a
 * prefetch, which would log people out unexpectedly.
 */
export const prerender = false;

export const POST: APIRoute = ({ cookies }) => {
  clearSession(cookies);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
