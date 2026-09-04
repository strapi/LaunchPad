import { getCurrentUser } from '#shared/lib/auth';
import type { SessionUser } from '#shared/types/strapi';

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
export default defineEventHandler(
  async (event): Promise<{ user: SessionUser | null }> => {
    setResponseHeader(event, 'cache-control', 'no-store, private');

    const token = getSessionToken(event);
    if (!token) return { user: null };

    const user = await getCurrentUser(strapiBaseUrl(), token);
    if (!user) {
      // The cookie decrypted but Strapi rejected the token — expired, or the
      // account is gone or blocked. Drop it so we stop asking.
      clearSessionCookie(event);
      return { user: null };
    }

    return {
      user: { id: user.id, username: user.username, email: user.email },
    };
  }
);
