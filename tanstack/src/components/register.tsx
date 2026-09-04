import {
  IconBrandGithubFilled,
  IconBrandGoogleFilled,
} from '@tabler/icons-react';
import { useForm } from '@tanstack/react-form';
import { Link, useRouter } from '@tanstack/react-router';
import { useState } from 'react';

import { Container } from './container';
import { Button } from './elements/button';
import { Logo } from './logo';
import { strapiApi } from '@/data/server-functions';
import { cn } from '@/lib/utils';
import type { SignupFormValues } from '@/lib/validations/auth';
import { SignupFormSchema } from '@/lib/validations/auth';

/**
 * Sign-up form using TanStack Form + Zod.
 *
 * Flow:
 *   1. User types → Zod validators run on change → per-field errors render
 *      in real time. Submit button stays disabled until form is valid.
 *   2. User clicks Sign up → `onSubmit` calls
 *      `strapiApi.auth.registerUserServerFunction({ data: value })`.
 *   3. Server function POSTs to Strapi, writes the `tanpad_session` HttpOnly
 *      cookie on success, returns `{ success, user }` or `{ success: false,
 *      error }`.
 *   4. On success: `router.invalidate()` then navigate to home.
 *   5. On error: display `serverError` banner above the form.
 */
export const Register = ({ locale = 'en' }: { locale?: string }) => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
    } as SignupFormValues,
    validators: { onChange: SignupFormSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = await strapiApi.auth.registerUserServerFunction({
          data: value,
        });
        if (result.success) {
          await router.invalidate();
          router.navigate({ to: `/${locale}` as any });
        } else {
          setServerError(result.error);
        }
      } catch (err) {
        console.error('Sign-up error:', err);
        // Surface the real error message instead of a generic string —
        // makes misconfig errors (e.g. missing SESSION_SECRET) visible
        // in the UI without needing to dig through DevTools.
        setServerError(
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred. Please try again.'
        );
      }
    },
  });

  const { Field, handleSubmit, state } = form;

  return (
    <Container className="h-screen max-w-lg mx-auto flex flex-col items-center justify-center">
      <Logo locale={locale} />
      <h1 className="text-xl md:text-4xl font-bold my-4">
        Sign up for LaunchPad
      </h1>

      {serverError && (
        <div
          role="alert"
          className="w-full p-3 mb-2 rounded-md border border-red-800/60 bg-red-900/30 text-sm text-red-300"
        >
          {serverError}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void handleSubmit();
        }}
        className="w-full my-4"
      >
        <Field name="username">
          {(field) => (
            <div className="mb-4">
              <input
                id={field.name}
                name={field.name}
                type="text"
                placeholder="Username"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                disabled={state.isSubmitting}
                className={cn(
                  'h-10 pl-4 w-full rounded-md text-sm bg-charcoal border text-white placeholder-neutral-500 outline-none focus:outline-none active:outline-none focus:ring-2 disabled:opacity-50',
                  field.state.meta.errors.length > 0
                    ? 'border-red-500/60 focus:ring-red-500/40'
                    : 'border-neutral-800 focus:ring-neutral-800'
                )}
              />
              <FieldErrors errors={field.state.meta.errors} />
            </div>
          )}
        </Field>

        <Field name="email">
          {(field) => (
            <div className="mb-4">
              <input
                id={field.name}
                name={field.name}
                type="email"
                placeholder="Email Address"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                disabled={state.isSubmitting}
                className={cn(
                  'h-10 pl-4 w-full rounded-md text-sm bg-charcoal border text-white placeholder-neutral-500 outline-none focus:outline-none active:outline-none focus:ring-2 disabled:opacity-50',
                  field.state.meta.errors.length > 0
                    ? 'border-red-500/60 focus:ring-red-500/40'
                    : 'border-neutral-800 focus:ring-neutral-800'
                )}
              />
              <FieldErrors errors={field.state.meta.errors} />
            </div>
          )}
        </Field>

        <Field name="password">
          {(field) => (
            <div className="mb-4">
              <input
                id={field.name}
                name={field.name}
                type="password"
                placeholder="Password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                disabled={state.isSubmitting}
                className={cn(
                  'h-10 pl-4 w-full rounded-md text-sm bg-charcoal border text-white placeholder-neutral-500 outline-none focus:outline-none active:outline-none focus:ring-2 disabled:opacity-50',
                  field.state.meta.errors.length > 0
                    ? 'border-red-500/60 focus:ring-red-500/40'
                    : 'border-neutral-800 focus:ring-neutral-800'
                )}
              />
              <FieldErrors errors={field.state.meta.errors} />
            </div>
          )}
        </Field>

        <Button
          variant="muted"
          type="submit"
          className="w-full py-3"
          disabled={state.isSubmitting || !state.canSubmit}
        >
          <span className="text-sm">
            {state.isSubmitting ? 'Signing up…' : 'Sign up'}
          </span>
        </Button>
      </form>

      <p className="text-sm text-neutral-400">
        Already have an account?{' '}
        <Link
          to={`/${locale}/sign-in` as any}
          className="text-white underline hover:text-neutral-300 transition-colors"
        >
          Sign in
        </Link>
      </p>

      <Divider />

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <button
          type="button"
          className="flex flex-1 justify-center space-x-2 items-center bg-white px-4 py-3 rounded-md text-black hover:bg-white/80 transition duration-200 shadow-[0px_1px_0px_0px_#00000040_inset]"
        >
          <IconBrandGithubFilled className="h-4 w-4 text-black" />
          <span className="text-sm">Login with GitHub</span>
        </button>
        <button
          type="button"
          className="flex flex-1 justify-center space-x-2 items-center bg-white px-4 py-3 rounded-md text-black hover:bg-white/80 transition duration-200 shadow-[0px_1px_0px_0px_#00000040_inset]"
        >
          <IconBrandGoogleFilled className="h-4 w-4 text-black" />
          <span className="text-sm">Login with Google</span>
        </button>
      </div>
    </Container>
  );
};

/** Renders the first Zod validation error for a field, if any. */
function FieldErrors({ errors }: { errors: ReadonlyArray<unknown> }) {
  if (errors.length === 0) return null;
  const first = errors[0];
  const message =
    typeof first === 'string'
      ? first
      : ((first as { message?: string } | undefined)?.message ??
        'Invalid value');
  return <p className="mt-1 text-xs text-red-400">{message}</p>;
}

const Divider = () => {
  return (
    <div className="relative w-full py-8">
      <div className="w-full h-px bg-neutral-700 rounded-tr-xl rounded-tl-xl" />
      <div className="w-full h-px bg-neutral-800 rounded-br-xl rounded-bl-xl" />
      <div className="absolute inset-0 h-5 w-5 m-auto rounded-md px-3 py-0.5 text-xs bg-neutral-800 shadow-[0px_-1px_0px_0px_var(--neutral-700)] flex items-center justify-center">
        OR
      </div>
    </div>
  );
};
