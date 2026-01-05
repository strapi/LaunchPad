'use client';

import { Link } from 'next-view-transitions';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

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
  const pathname = usePathname();

  const normalizedPathname = pathname?.replace(/\/$/, "") || "/";
  const normalizedHref = href?.replace(/\/$/, "") || "/";

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center justify-center text-sm leading-[110%] px-4 py-2 rounded-md border border-transparent transition duration-200',
        // Hover : bg blanc + bordure bleu
        'hover:bg-white hover:border-blue-600',
        // Actif : bg muted + texte muted
        (active || normalizedPathname === normalizedHref) && 'bg-muted text-muted-foreground',
        className
      )}
      target={target}
    >
      {children}
    </Link>
  );
}
