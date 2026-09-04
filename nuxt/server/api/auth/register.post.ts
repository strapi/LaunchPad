import { register, validateCredentials } from '#shared/lib/auth';

/** POST /api/auth/register — creates a Strapi user and starts a session. */
export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => null);
  if (!body || typeof body !== 'object') {
    setResponseStatus(event, 400);
    return { error: 'Invalid request body.' };
  }

  const { username, email, password } = body as Record<string, unknown>;

  const invalid = validateCredentials({
    email,
    password,
    username,
    requireUsername: true,
  });
  if (invalid) {
    setResponseStatus(event, 400);
    return { error: invalid };
  }

  const result = await register(strapiBaseUrl(), {
    username: String(username).trim(),
    email: String(email).trim(),
    password: String(password),
  });

  if (!result.ok || !result.jwt) {
    setResponseStatus(event, result.status);
    return { error: result.error };
  }

  setSessionCookie(event, result.jwt);
  setResponseStatus(event, 201);
  return { user: result.user };
});
