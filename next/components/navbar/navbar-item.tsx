"use client";

import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

type Props = {
  href: string;
  children: ReactNode;
  active?: boolean;
  className?: string;
  target?: "_blank";
};

export function NavbarItem({
  children,
  href,
  active,
  target,
  className,
}: Props) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-center  text-sm leading-[110%] px-4 py-2 rounded-md  hover:bg-neutral-800 hover:text-white/80 text-white hover:shadow-[0px_1px_0px_0px_var(--neutral-600)_inset] transition duration-200",
        (active || pathname?.includes(href)) && "bg-transparent text-white",
        className
      )}
      target={target}
    >
      {children}
    </Link>
  );
}
