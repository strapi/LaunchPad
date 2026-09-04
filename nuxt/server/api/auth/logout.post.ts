/**
 * POST /api/auth/logout — clears the session cookie.
 *
 * POST rather than GET so it cannot be triggered by a stray <img> or a
 * prefetch, which would log people out unexpectedly.
 */
export default defineEventHandler((event) => {
  clearSessionCookie(event);
  return { ok: true };
});
