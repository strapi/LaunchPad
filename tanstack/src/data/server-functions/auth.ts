import { createServerFn } from '@tanstack/react-start';

import {
  isAuthError,
  loginUserService,
  registerUserService,
} from '@/lib/services/auth';
import { clearAuth, getAuth, useAppSession } from '@/lib/session';
import type {
  SigninFormValues,
  SignupFormValues,
} from '@/lib/validations/auth';
import { SigninFormSchema, SignupFormSchema } from '@/lib/validations/auth';
import type { TAuthUser } from '@/types/auth';

/**
 * Discriminated union returned to the client.
 *
 *   success = true  → navigate home, auth cookie is set
 *   success = false → display `error` message to the user; if `fieldErrors`
 *                     is present, also show per-field errors from server-side
 *                     Zod validation (should rarely fire because the client
 *                     already validates the same schema).
 */
export type RegisterResult =
  | { success: true; user: TAuthUser }
  | {
      success: false;
      error: string;
      fieldErrors?: Partial<Record<keyof SignupFormValues, Array<string>>>;
    };

/**
 * Registers a new user with Strapi's /api/auth/local/register and sets an
 * HttpOnly session cookie via `useAppSession().update()`.
 *
 * Client contract: input is a plain object (from TanStack Form's `onSubmit`
 * value), not FormData.
 *
 * Flow:
 *   1. Server-side Zod validation (defense in depth)
 *   2. POST to Strapi → { jwt, user } or { error }
 *   3. Discriminate via `isAuthError`
 *   4. On success: write session cookie + return user
 *   5. On error: return the Strapi error message
 *
 * Side effect: on success, a `Set-Cookie: tanpad_session=<encrypted>; HttpOnly`
 * header is attached to the response by `session.update()`.
 */
export const registerUserServerFunction = createServerFn({ method: 'POST' })
  .inputValidator((data: SignupFormValues) => data)
  .handler(async ({ data }): Promise<RegisterResult> => {
    // Defense-in-depth: validate again server-side even though client did
    const validated = SignupFormSchema.safeParse(data);
    if (!validated.success) {
      const flattened = validated.error.flatten();
      return {
        success: false,
        error: 'Validation failed',
        fieldErrors: flattened.fieldErrors as Partial<
          Record<keyof SignupFormValues, Array<string>>
        >,
      };
    }

    // Acquire the session handle FIRST so we fail fast on config errors
    // (e.g. missing SESSION_SECRET) before creating a user in Strapi.
    // Without this, a misconfig would create an orphaned Strapi user and
    // throw afterwards, leaving the DB in a weird state.
    const session = await useAppSession();

    const response = await registerUserService(validated.data);

    if (!response) {
      return {
        success: false,
        error: 'Could not reach the server. Please try again.',
      };
    }

    if (isAuthError(response)) {
      return {
        success: false,
        error: response.error.message || 'Registration failed',
      };
    }

    // Success — write the session cookie
    await session.update({
      userId: response.user.id,
      email: response.user.email,
      username: response.user.username,
      jwt: response.jwt,
    });

    return { success: true, user: response.user };
  });

/**
 * Discriminated union for the login server function response.
 */
export type LoginResult =
  | { success: true; user: TAuthUser }
  | {
      success: false;
      error: string;
      fieldErrors?: Partial<Record<keyof SigninFormValues, Array<string>>>;
    };

/**
 * Authenticates against Strapi's /api/auth/local and sets the HttpOnly
 * session cookie on success. Same structure as `registerUserServerFunction`
 * — session handle acquired BEFORE the Strapi call so config errors fail
 * fast without leaving side effects.
 */
export const loginUserServerFunction = createServerFn({ method: 'POST' })
  .inputValidator((data: SigninFormValues) => data)
  .handler(async ({ data }): Promise<LoginResult> => {
    const validated = SigninFormSchema.safeParse(data);
    if (!validated.success) {
      const flattened = validated.error.flatten();
      return {
        success: false,
        error: 'Validation failed',
        fieldErrors: flattened.fieldErrors as Partial<
          Record<keyof SigninFormValues, Array<string>>
        >,
      };
    }

    const session = await useAppSession();

    const response = await loginUserService(validated.data);

    if (!response) {
      return {
        success: false,
        error: 'Could not reach the server. Please try again.',
      };
    }

    if (isAuthError(response)) {
      return {
        success: false,
        error: response.error.message || 'Login failed',
      };
    }

    await session.update({
      userId: response.user.id,
      email: response.user.email,
      username: response.user.username,
      jwt: response.jwt,
    });

    return { success: true, user: response.user };
  });

/**
 * Clears the session cookie + in-memory auth cache.
 * Used on explicit logout.
 */
export const logoutUserServerFunction = createServerFn({
  method: 'POST',
}).handler(async () => {
  await clearAuth();
  return { success: true };
});

/**
 * Validates the current session JWT against Strapi's /users/me and returns
 * the authenticated user (or null).
 *
 * Intended for loader use — e.g. `$locale.tsx` or `__root.tsx` can call this
 * to hydrate the navbar with logged-in user info. Not wired up to any loader
 * in this slice; that's deferred per slice 5 plan.
 */
export const getAuthServerFunction = createServerFn({
  method: 'GET',
}).handler(async () => {
  return getAuth();
});

/**
 * Lightweight read of the session cookie without Strapi round-trip.
 * Returns whatever's stored in the session data (trusted because the cookie
 * is signed + encrypted). Use this when you only need cheap "is the user
 * logged in" checks, not fresh user data.
 */
export const getCurrentUserServerFunction = createServerFn({
  method: 'GET',
}).handler(async () => {
  const session = await useAppSession();
  if (!session.data.userId) return null;
  return {
    userId: session.data.userId,
    email: session.data.email,
    username: session.data.username,
  };
});
