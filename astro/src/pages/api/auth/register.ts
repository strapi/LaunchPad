import type { APIRoute } from 'astro';

import { register, validateCredentials } from '@/lib/auth';
import { setSession } from '@/lib/session';

/** POST /api/auth/register — creates a Strapi user and starts a session. */
export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return json({ error: 'Invalid request body.' }, 400);
  }

  const { username, email, password } = body as Record<string, unknown>;

  const invalid = validateCredentials({
    email,
    password,
    username,
    requireUsername: true,
  });
  if (invalid) return json({ error: invalid }, 400);

  const result = await register({
    username: String(username).trim(),
    email: String(email).trim(),
    password: String(password),
  });

  if (!result.ok || !result.jwt) {
    return json({ error: result.error }, result.status);
  }

  setSession(cookies, result.jwt);
  return json({ user: result.user }, 201);
};

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
