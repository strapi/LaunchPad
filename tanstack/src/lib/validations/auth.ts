import { z } from 'zod';

/**
 * Sign-up form validation schema.
 *
 * Matches Strapi's Users & Permissions plugin register endpoint which
 * requires username + email + password. Used by both:
 *   1. Client-side in `Register.tsx` via TanStack Form `onChange` validator
 *      (real-time errors under each field).
 *   2. Server-side in `registerUserServerFunction` as defense-in-depth
 *      before hitting Strapi, even though the client already validated.
 */
export const SignupFormSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters'),
  email: z.email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
});

export type SignupFormValues = z.infer<typeof SignupFormSchema>;

/**
 * Sign-in form schema. Strapi's /api/auth/local endpoint accepts `identifier`
 * which can be either a username or an email — both are valid login values.
 */
export const SigninFormSchema = z.object({
  identifier: z
    .string()
    .min(3, 'Username or email must be at least 3 characters'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
});

export type SigninFormValues = z.infer<typeof SigninFormSchema>;
