import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

/**
 * Renders `children` only after the component has mounted on the client.
 * Used to gate browser-only code (three.js, canvas APIs, window access)
 * that would otherwise fail or mismatch during SSR.
 */
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? <>{children}</> : <>{fallback}</>;
}
