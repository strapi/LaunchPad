import { STRAPI_URL } from '@/lib/strapi';

/**
 * Strapi's users-permissions endpoints, plus input validation.
 *
 * Validation is hand-rolled rather than pulled from a schema library: it is
 * three fields, and the checks below are the ones Strapi enforces anyway. The
 * point of doing it here is a useful message before a round trip, not a second
 * source of truth — Strapi remains the authority and its errors are surfaced.
 */

export interface AuthUser {
  id: number;
  username: string;
  email: string;
}

export interface AuthResult {
  ok: boolean;
  status: number;
  /** Present when ok. */
  jwt?: string;
  user?: AuthUser;
  /** Present when not ok — safe to show a visitor. */
  error?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCredentials(input: {
  email?: unknown;
  password?: unknown;
  username?: unknown;
  requireUsername?: boolean;
}): string | null {
  const { email, password, username, requireUsername } = input;

  if (typeof email !== 'string' || !EMAIL_PATTERN.test(email.trim())) {
    return 'Enter a valid email address.';
  }
  if (typeof password !== 'string' || password.length < 6) {
    return 'Password must be at least 6 characters.';
  }
  if (requireUsername) {
    if (typeof username !== 'string' || username.trim().length < 3) {
      return 'Username must be at least 3 characters.';
    }
  }
  return null;
}

/**
 * Pulls a human-readable message out of Strapi's error envelope without
 * leaking internals. Strapi nests the useful text a few levels down and
 * sometimes only in `details.errors`.
 */
function readStrapiError(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== 'object') return fallback;

  const error = (payload as { error?: Record<string, unknown> }).error;
  if (!error) return fallback;

  const details = error.details as { errors?: Array<{ message?: string }> };
  const first = details?.errors?.[0]?.message;
  if (typeof first === 'string' && first) return first;

  return typeof error.message === 'string' && error.message
    ? error.message
    : fallback;
}

async function post(path: string, body: unknown): Promise<AuthResult> {
  let response: Response;
  try {
    response = await fetch(`${STRAPI_URL}/api${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    return {
      ok: false,
      status: 503,
      error: 'Could not reach the server. Is Strapi running?',
    };
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: readStrapiError(payload, 'Something went wrong. Try again.'),
    };
  }

  const { jwt, user } = (payload ?? {}) as { jwt?: string; user?: AuthUser };
  if (!jwt || !user) {
    return {
      ok: false,
      status: 502,
      error: 'Unexpected response from Strapi.',
    };
  }

  return { ok: true, status: 200, jwt, user };
}

export function register(input: {
  username: string;
  email: string;
  password: string;
}): Promise<AuthResult> {
  return post('/auth/local/register', input);
}

export function login(input: {
  identifier: string;
  password: string;
}): Promise<AuthResult> {
  return post('/auth/local', input);
}

/**
 * Verifies a JWT against Strapi rather than trusting the cookie's contents.
 *
 * A decryptable cookie only proves it was issued by this server — not that the
 * account still exists, is unblocked, or that the token has not expired. Those
 * are Strapi's to answer, so every session read asks it.
 */
export async function getCurrentUser(jwt: string): Promise<AuthUser | null> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    if (!response.ok) return null;
    return (await response.json()) as AuthUser;
  } catch {
    return null;
  }
}
