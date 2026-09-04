import { Link, useLocation } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type Props = {
  href: string;
  children: ReactNode;
  active?: boolean;
  className?: string;
  target?: string;
};

export function NavbarItem({
  children,
  href,
  active,
  target,
  className,
}: Props) {
  const location = useLocation();

  return (
    <Link
      to={href as any}
      className={cn(
        'flex items-center justify-center  text-sm leading-[110%] px-4 py-2 rounded-md  hover:bg-neutral-800 hover:text-white/80 text-white hover:shadow-[0px_1px_0px_0px_var(--neutral-600)_inset] transition duration-200',
        (active || location.pathname.includes(href)) &&
          'bg-transparent text-white',
        className
      )}
      target={target}
      suppressHydrationWarning
    >
      {children}
    </Link>
  );
}
