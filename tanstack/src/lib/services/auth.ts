import { getStrapiURL } from '@/lib/utils';
import type { TAuthUser } from '@/types/auth';

type TRegisterUser = {
  username: string;
  email: string;
  password: string;
};

type TLoginUser = {
  identifier: string;
  password: string;
};

type TAuthResponse = {
  jwt: string;
  user: TAuthUser;
};

type TStrapiErrorResponse = {
  error: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, unknown>;
  };
};

type TAuthServiceResponse = TAuthResponse | TStrapiErrorResponse;

/** Type guards for discriminating Strapi's success vs error response shapes. */
export function isAuthError(
  response: TAuthServiceResponse
): response is TStrapiErrorResponse {
  return 'error' in response;
}

export function isAuthSuccess(
  response: TAuthServiceResponse
): response is TAuthResponse {
  return 'jwt' in response;
}

const baseUrl = getStrapiURL();

/**
 * POST to Strapi's Users & Permissions register endpoint.
 * Returns either `{ jwt, user }` on success or `{ error: {...} }` on failure.
 * Returns `undefined` only on network-level errors (DNS, offline, etc).
 *
 * IMPORTANT: Strapi's Public role must have `Users-Permissions > Auth > register`
 * enabled for this to return 200. Otherwise Strapi returns 403.
 */
export async function registerUserService(
  userData: TRegisterUser
): Promise<TAuthServiceResponse | undefined> {
  const url = new URL('/api/auth/local/register', baseUrl);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = (await response.json()) as TAuthServiceResponse;
    return data;
  } catch (error) {
    console.error('Registration Service Error:', error);
    return undefined;
  }
}

/**
 * POST to Strapi's Users & Permissions local login endpoint.
 * Accepts either username or email as the `identifier`.
 */
export async function loginUserService(
  userData: TLoginUser
): Promise<TAuthServiceResponse | undefined> {
  const url = new URL('/api/auth/local', baseUrl);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = (await response.json()) as TAuthServiceResponse;
    return data;
  } catch (error) {
    console.error('Login Service Error:', error);
    return undefined;
  }
}
