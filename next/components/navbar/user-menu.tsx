'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/elements/button';
import { signOut, useSession } from '@/lib/auth-client';

export const UserMenu = ({ locale }: { locale: string }) => {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (isPending) return null;

  if (!session?.user) return null;

  const displayName = session.user.name || session.user.email;

  async function handleSignOut() {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
    router.push(`/${locale}`);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-white text-sm whitespace-nowrap">
        Hi {displayName}
      </span>
      <Button
        variant="simple"
        onClick={handleSignOut}
        disabled={isSigningOut}
      >
        {isSigningOut ? 'Logging out…' : 'Logout'}
      </Button>
    </div>
  );
};
