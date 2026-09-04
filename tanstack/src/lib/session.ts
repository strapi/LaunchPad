import { getCookie, useSession } from '@tanstack/react-start/server';

import type { SessionData, TAuthUser } from '@/types/auth';

/**
 * Single source of truth for the session cookie name. Used by:
 *   - `useAppSession()` via `getSessionConfig().name`
 *   - `getCookie()` in the `getAuth` fast-path
 */
const SESSION_COOKIE_NAME = 'tanpad_session';

/**
 * Reads and validates the SESSION_SECRET env var.
 *
 * Production-strict: no dev fallback. If the secret is missing or too short,
 * this throws the first time any auth code path runs.
 */
function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      'SESSION_SECRET environment variable is required. ' +
        'Generate one with: `openssl rand -base64 48`, then add it to .env'
    );
  }
  if (secret.length < 32) {
    throw new Error(
      `SESSION_SECRET must be at least 32 characters long (got ${secret.length}). ` +
        'Use a longer secret for HMAC + encryption safety.'
    );
  }
  return secret;
}

/**
 * Session config matching h3-v2's `SessionConfig` interface shape exactly:
 *
 *   - `password`: encryption / HMAC key
 *   - `maxAge`: session expiration in SECONDS — **top-level**, not inside
 *     `cookie`. This is h3's canonical location. h3's `updateSession` uses
 *     it to compute the cookie's `expires` attribute, and `unsealSession`
 *     uses it for the session TTL check. Putting `maxAge` inside
 *     `config.cookie` leaks into `clearSession` and prevents the cookie
 *     from being deleted on logout.
 *   - `cookie`: cookie attributes ONLY (flags, path, domain — no expiry)
 */
function getSessionConfig() {
  return {
    name: SESSION_COOKIE_NAME,
    password: getSessionSecret(),
    maxAge: 60 * 60 * 24 * 7, // 7 days, top-level
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    },
  };
}

/**
 * Returns the signed + encrypted HttpOnly session handle.
 *
 * ⚠️ Only call from WRITE paths (login, register, logout). See `getAuth`
 * below for why: h3's `useSession` auto-creates a new anonymous session
 * with a fresh UUID and writes it to the response if no valid cookie is
 * present, which would regenerate the cookie immediately after logout.
 */
export function useAppSession() {
  return useSession<SessionData>(getSessionConfig());
}

// ---------------------------------------------------------------------------
// Auth validation + cache
// ---------------------------------------------------------------------------

const authCache = new Map<string, { user: TAuthUser; timestamp: number }>();
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

/**
 * Reads the JWT from the session cookie (if any), validates it against
 * Strapi's /users/me endpoint, and returns the user (or null if not
 * logged in).
 *
 * Short-circuits on missing cookie BEFORE calling `useAppSession()` to
 * prevent h3's auto-create behavior. See `getSession` in h3-v2's
 * `h3-ByfIX5Jk.mjs:2015-2019`:
 *
 *   if (!session.id) {
 *     session.id = crypto.randomUUID()
 *     session.createdAt = Date.now()
 *     await updateSession(event, config)  // ← writes a new cookie
 *   }
 *
 * Without this fast-path, every anonymous request would get a phantom
 * session cookie written to its response, and `router.invalidate()` after
 * logout would immediately regenerate the cookie we just deleted.
 */
export async function getAuth(): Promise<TAuthUser | null> {
  const cookieValue = getCookie(SESSION_COOKIE_NAME);
  if (!cookieValue) return null;

  const session = await useAppSession();
  const jwt = session.data.jwt;
  if (!jwt) return null;

  const cached = authCache.get(jwt);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.user;
  }

  try {
    const { getUserMe } = await import('@/data/strapi-sdk');
    const user = await getUserMe(jwt);

    authCache.set(jwt, { user, timestamp: Date.now() });

    await session.update({
      ...session.data,
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    return user;
  } catch (error) {
    console.error('Auth validation error:', error);

    if (cached) return cached.user;

    authCache.delete(jwt);
    await clearAuth();
    return null;
  }
}

/**
 * Logs the user out by clearing the session cookie + in-memory cache.
 *
 * Uses the canonical TanStack Start pattern from the official docs:
 * `await session.clear()` via the SessionManager returned from
 * `useAppSession()`. With `maxAge` now at the top-level of the session
 * config (not inside `cookie`), `clearSession` — which h3's `session.clear`
 * calls internally — writes a cookie with empty value and no expiry
 * inherited from our write-time maxAge.
 *
 * The combination of:
 *   1. This clear writing an empty-value cookie
 *   2. The `getCookie` gate in `getAuth` treating empty-string cookies as
 *      "no cookie" (JS falsy check)
 * ensures anonymous reads after logout do NOT trigger h3's auto-create
 * session behavior, so the cookie stays empty until the browser drops it.
 */
export async function clearAuth(): Promise<void> {
  const session = await useAppSession();
  const jwt = session.data.jwt;
  if (jwt) authCache.delete(jwt);
  await session.clear();
}
