/**
 * Shape returned by Strapi's Users & Permissions plugin for
 * `/api/auth/local/register`, `/api/auth/local`, and `/api/users/me`.
 */
export type TAuthUser = {
  id: number;
  documentId?: string;
  username: string;
  email: string;
  provider?: string;
  confirmed?: boolean;
  blocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

/** What the app stores in the HttpOnly session cookie. */
export type SessionData = {
  userId?: number;
  email?: string;
  username?: string;
  jwt?: string;
};
