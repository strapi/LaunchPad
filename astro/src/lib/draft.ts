import type { AstroCookies } from 'astro';

/**
 * Draft mode.
 *
 * The public site is prerendered, so "am I previewing?" cannot be a build-time
 * decision — it has to come from the request. A single HttpOnly cookie carries
 * it, set by `/api/preview` once the shared secret has been checked.
 *
 * The cookie value is an opaque marker, not the secret itself: the secret only
 * grants access, and once granted the HttpOnly cookie is the proof. Putting a
 * secret in a cookie would widen the attack surface for no benefit.
 */

export const DRAFT_COOKIE = 'strapi-draft';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  path: '/',
  secure: import.meta.env.PROD,
} as const;

export function isDraftMode(cookies: AstroCookies): boolean {
  return cookies.get(DRAFT_COOKIE)?.value === '1';
}

export function enableDraftMode(cookies: AstroCookies): void {
  // Session cookie, deliberately without maxAge — preview access should not
  // outlive the browser session.
  cookies.set(DRAFT_COOKIE, '1', COOKIE_OPTIONS);
}

export function disableDraftMode(cookies: AstroCookies): void {
  cookies.delete(DRAFT_COOKIE, { path: '/' });
}
