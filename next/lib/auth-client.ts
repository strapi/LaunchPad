import { createAuthClient } from 'better-auth/react';

import { API_URL } from './utils';

export const authClient = createAuthClient({
  baseURL: `${API_URL}/api/better-auth`,
});

export const { signIn, signUp, signOut, useSession } = authClient;
