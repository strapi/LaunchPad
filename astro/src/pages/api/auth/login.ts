import type { APIRoute } from 'astro';

import { login, validateCredentials } from '@/lib/auth';
import { setSession } from '@/lib/session';

/** POST /api/auth/login — exchanges credentials for a session cookie. */
export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return json({ error: 'Invalid request body.' }, 400);
  }

  const { email, password } = body as Record<string, unknown>;

  const invalid = validateCredentials({ email, password });
  if (invalid) return json({ error: invalid }, 400);

  const result = await login({
    identifier: String(email).trim(),
    password: String(password),
  });

  if (!result.ok || !result.jwt) {
    // Deliberately generic: distinguishing "no such account" from "wrong
    // password" tells an attacker which emails are registered.
    return json({ error: 'Incorrect email or password.' }, 401);
  }

  setSession(cookies, result.jwt);
  return json({ user: result.user }, 200);
};

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
