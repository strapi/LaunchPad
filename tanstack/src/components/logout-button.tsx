import { IconLogout } from '@tabler/icons-react';
import { useRouter } from '@tanstack/react-router';
import { useState } from 'react';

import { strapiApi } from '@/data/server-functions';
import { cn } from '@/lib/utils';

/**
 * Log out button.
 *
 * Calls `logoutUserServerFunction` which clears the HttpOnly session cookie
 * and the in-memory auth cache on the server, then invalidates the router
 * so every loader re-runs (re-fetching `currentUser` as null) and finally
 * navigates to the locale home.
 */
export function LogoutButton({
  locale = 'en',
  className,
}: {
  locale?: string;
  className?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await strapiApi.auth.logoutUserServerFunction();
      await router.invalidate();
      router.navigate({ to: `/${locale}` as any });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      aria-label="Log out"
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-md text-sm text-white hover:bg-neutral-800 border border-transparent transition duration-200 disabled:opacity-50',
        className
      )}
    >
      <IconLogout className="h-4 w-4" />
      <span className="hidden md:inline">
        {loading ? 'Logging out…' : 'Log out'}
      </span>
    </button>
  );
}
