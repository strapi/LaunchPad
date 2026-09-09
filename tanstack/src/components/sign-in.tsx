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
import type { SigninFormValues } from '@/lib/validations/auth';
import { SigninFormSchema } from '@/lib/validations/auth';

/**
 * Sign-in form, parallel to `<Register>`. Uses TanStack Form + Zod.
 * Strapi's /api/auth/local accepts either username or email as `identifier`.
 */
export const SignIn = ({ locale = 'en' }: { locale?: string }) => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      identifier: '',
      password: '',
    } as SigninFormValues,
    validators: { onChange: SigninFormSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = await strapiApi.auth.loginUserServerFunction({
          data: value,
        });
        if (result.success) {
          await router.invalidate();
          router.navigate({ to: `/${locale}` as any });
        } else {
          setServerError(result.error);
        }
      } catch (err) {
        console.error('Sign-in error:', err);
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
        Sign in to LaunchPad
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
        <Field name="identifier">
          {(field) => (
            <div className="mb-4">
              <input
                id={field.name}
                name={field.name}
                type="text"
                placeholder="Username or Email"
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
            {state.isSubmitting ? 'Signing in…' : 'Sign in'}
          </span>
        </Button>
      </form>

      <p className="text-sm text-neutral-400">
        Don't have an account?{' '}
        <Link
          to={`/${locale}/sign-up` as any}
          className="text-white underline hover:text-neutral-300 transition-colors"
        >
          Sign up
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
