import { login, validateCredentials } from '#shared/lib/auth';

/**
 * POST /api/auth/login — exchanges credentials for a session cookie.
 *
 * Failures set a status and return `{ error }` rather than throwing
 * `createError`, which would wrap the message in Nitro's error envelope and
 * leave the form digging through `err.data.data.error`. `$fetch` still rejects
 * on a 4xx, and the body lands on `err.data` intact.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => null);
  if (!body || typeof body !== 'object') {
    setResponseStatus(event, 400);
    return { error: 'Invalid request body.' };
  }

  const { email, password } = body as Record<string, unknown>;

  const invalid = validateCredentials({ email, password });
  if (invalid) {
    setResponseStatus(event, 400);
    return { error: invalid };
  }

  const result = await login(strapiBaseUrl(), {
    identifier: String(email).trim(),
    password: String(password),
  });

  if (!result.ok || !result.jwt) {
    // Deliberately generic: distinguishing "no such account" from "wrong
    // password" tells an attacker which emails are registered.
    setResponseStatus(event, 401);
    return { error: 'Incorrect email or password.' };
  }

  setSessionCookie(event, result.jwt);
  return { user: result.user };
});
