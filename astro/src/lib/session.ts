import type { AstroCookies } from 'astro';
import crypto from 'node:crypto';

/**
 * Session cookie.
 *
 * Strapi issues a JWT on login. That JWT is what proves identity, so it lives
 * in an HttpOnly cookie — never in localStorage, where any script on the page
 * could read it.
 *
 * The JWT is additionally encrypted with AES-256-GCM before it goes into the
 * cookie. HttpOnly already keeps it away from page scripts, so this is
 * defence in depth: it means a cookie recovered from a disk backup, a synced
 * browser profile, or a misconfigured proxy log is opaque rather than a
 * ready-to-use bearer token. GCM also authenticates, so a tampered cookie
 * fails to decrypt instead of decrypting to garbage.
 */

const COOKIE_NAME = 'launchpad-session';
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;

function getKey(): Buffer {
  const secret = import.meta.env.SESSION_SECRET ?? process.env.SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      'SESSION_SECRET must be set and at least 32 characters. Run `yarn setup`, or generate one with `openssl rand -base64 48`.'
    );
  }

  // scrypt turns an arbitrary-length passphrase into a fixed 32-byte key.
  // The salt is fixed because the secret is already high-entropy and the key
  // has to be reproducible across restarts and across server instances.
  return crypto.scryptSync(secret, 'launchpad-session-v1', 32);
}

export function encryptSession(token: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(token, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  // iv.tag.ciphertext — the iv and tag are not secret, only the key is.
  return [
    iv.toString('base64url'),
    tag.toString('base64url'),
    encrypted.toString('base64url'),
  ].join('.');
}

export function decryptSession(value: string): string | null {
  try {
    const [ivPart, tagPart, dataPart] = value.split('.');
    if (!ivPart || !tagPart || !dataPart) return null;

    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      getKey(),
      Buffer.from(ivPart, 'base64url')
    );
    decipher.setAuthTag(Buffer.from(tagPart, 'base64url'));

    return Buffer.concat([
      decipher.update(Buffer.from(dataPart, 'base64url')),
      decipher.final(),
    ]).toString('utf8');
  } catch {
    // Wrong key, tampering, or a cookie from an older secret. All mean the
    // same thing to the caller: no valid session.
    return null;
  }
}

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  path: '/',
  secure: import.meta.env.PROD,
  // Seven days. Strapi's own JWT expiry still applies and is checked on every
  // read, so this only bounds how long a stale cookie hangs around.
  maxAge: 60 * 60 * 24 * 7,
} as const;

export function setSession(cookies: AstroCookies, token: string): void {
  cookies.set(COOKIE_NAME, encryptSession(token), COOKIE_OPTIONS);
}

export function clearSession(cookies: AstroCookies): void {
  // Attributes must match the ones used to set it or the browser keeps it.
  cookies.delete(COOKIE_NAME, { path: '/' });
}

/** Returns the Strapi JWT from the session cookie, or null. */
export function getSessionToken(cookies: AstroCookies): string | null {
  const raw = cookies.get(COOKIE_NAME)?.value;
  return raw ? decryptSession(raw) : null;
}
