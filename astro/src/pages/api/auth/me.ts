import type { APIRoute } from 'astro';

import { getCurrentUser } from '@/lib/auth';
import { clearSession, getSessionToken } from '@/lib/session';

/**
 * GET /api/auth/me — who, if anyone, is signed in.
 *
 * This is what makes the hybrid model work: every page stays prerendered, and
 * the navbar asks this endpoint on load rather than the server baking identity
 * into the HTML.
 *
 * `no-store` matters — a cached response here would show one visitor's
 * identity to another.
 */
export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  const token = getSessionToken(cookies);
  if (!token) return json({ user: null });

  const user = await getCurrentUser(token);
  if (!user) {
    // The cookie decrypted but Strapi rejected the token — expired, or the
    // account is gone or blocked. Drop it so we stop asking.
    clearSession(cookies);
    return json({ user: null });
  }

  return json({
    user: { id: user.id, username: user.username, email: user.email },
  });
};

const json = (body: unknown) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store, private',
    },
  });
