import {
  deleteCookie,
  getCookie,
  setCookie,
} from '@tanstack/react-start/server';

/**
 * Single source of truth for the draft-mode cookie name.
 * Kept short ("draft") to match the original Next launchpad's `draftMode()`
 * cookie behavior and to keep the Strapi preview URL template simple.
 */
const DRAFT_COOKIE_NAME = 'draft';

/**
 * Returns true when the `draft` cookie is present on the current request.
 *
 * Replaces the Next launchpad's `await draftMode().isEnabled` with a
 * simple presence check. The cookie value is an opaque marker ('1');
 * we don't store the preview secret inside the cookie because:
 *   - The secret is only needed to GRANT preview access (at /api/preview).
 *   - Once granted, the HttpOnly cookie is the proof.
 *   - Storing secrets in cookies unnecessarily widens the attack surface.
 */
export function isDraftMode(): boolean {
  return !!getCookie(DRAFT_COOKIE_NAME);
}

/**
 * Enables draft mode by setting an HttpOnly cookie.
 * Called from `/api/preview` after the preview secret is validated.
 *
 * Cookie flags:
 *   - httpOnly: JS can't read it (XSS defense)
 *   - secure:   HTTPS-only in production
 *   - sameSite=lax: CSRF defense
 *   - path=/:  available on every route so every loader sees it
 *   - no maxAge: session cookie, expires on browser close (safer default
 *                than persistent draft access)
 */
export function setDraftMode(): void {
  setCookie(DRAFT_COOKIE_NAME, '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

/**
 * Disables draft mode by deleting the cookie.
 * Called from `/api/exit-preview` and from the DraftModeBanner exit button.
 *
 * Attributes must match `setDraftMode` for the browser to honor the delete.
 */
export function clearDraftMode(): void {
  deleteCookie(DRAFT_COOKIE_NAME, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
}
