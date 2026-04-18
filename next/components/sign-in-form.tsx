'use client';

import {
  IconBrandGithubFilled,
  IconBrandGoogleFilled,
} from '@tabler/icons-react';
import { Link } from 'next-view-transitions';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { Container } from './container';
import { Button } from './elements/button';
import { Logo } from './logo';
import { signIn } from '@/lib/auth-client';

export const SignInForm = () => {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'en';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { error: signInError } = await signIn.email({ email, password });

    setIsSubmitting(false);

    if (signInError) {
      setError(signInError.message ?? 'Sign in failed');
      return;
    }

    router.push('/');
    router.refresh();
  }

  async function handleSocial(provider: 'github' | 'google') {
    setError(null);
    const { error: socialError } = await signIn.social({
      provider,
      callbackURL: `/${locale}`,
    });
    if (socialError) {
      setError(socialError.message ?? `${provider} sign-in failed`);
    }
  }

  return (
    <Container className="h-screen max-w-lg mx-auto flex flex-col items-center justify-center">
      <Logo />
      <h1 className="text-xl md:text-4xl font-bold my-4">
        Sign in to LaunchPad
      </h1>

      <form className="w-full my-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-10 pl-4 w-full mb-4 rounded-md text-sm bg-charcoal border border-neutral-800 text-white placeholder-neutral-500 outline-none focus:outline-none active:outline-none focus:ring-2 focus:ring-neutral-800"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="h-10 pl-4 w-full mb-4 rounded-md text-sm bg-charcoal border border-neutral-800 text-white placeholder-neutral-500 outline-none focus:outline-none active:outline-none focus:ring-2 focus:ring-neutral-800"
        />
        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
        <Button
          variant="muted"
          type="submit"
          className="w-full py-3"
          disabled={isSubmitting}
        >
          <span className="text-sm">{isSubmitting ? 'Signing in…' : 'Sign in'}</span>
        </Button>
      </form>

      <p className="text-sm text-neutral-400">
        Don&apos;t have an account?{' '}
        <Link
          href={`/${locale}/sign-up`}
          className="text-white underline underline-offset-2 hover:text-secondary"
        >
          Sign up
        </Link>
      </p>

      <Divider />

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <button
          type="button"
          onClick={() => handleSocial('github')}
          className="flex flex-1 justify-center space-x-2 items-center bg-white px-4 py-3 rounded-md text-black hover:bg-white/80 transition duration-200 shadow-[0px_1px_0px_0px_#00000040_inset]"
        >
          <IconBrandGithubFilled className="h-4 w-4 text-black" />
          <span className="text-sm">Login with GitHub</span>
        </button>
        <button
          type="button"
          onClick={() => handleSocial('google')}
          className="flex flex-1 justify-center space-x-2 items-center bg-white px-4 py-3 rounded-md text-black hover:bg-white/80 transition duration-200 shadow-[0px_1px_0px_0px_#00000040_inset]"
        >
          <IconBrandGoogleFilled className="h-4 w-4 text-black" />
          <span className="text-sm">Login with Google</span>
        </button>
      </div>
    </Container>
  );
};

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
