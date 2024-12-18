"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSlugContext } from "@/app/context/SlugContext";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ currentLocale }: { currentLocale: string }) {
  const { state } = useSlugContext();
  const { localizedSlugs } = state;

  const pathname = usePathname(); // Current path
  const segments = pathname.split("/"); // Split path into segments

  // Generate localized path for each locale
  const generateLocalizedPath = (locale: string): string => {
    if (!pathname) return `/${locale}`; // Default to root path for the locale

    // Handle homepage (e.g., "/en" -> "/fr")
    if (segments.length <= 2) {
      return `/${locale}`;
    }

    // Handle dynamic paths (e.g., "/en/blog/[slug]")
    if (localizedSlugs[locale]) {
      segments[1] = locale; // Replace the locale
      segments[segments.length - 1] = localizedSlugs[locale]; // Replace slug if available
      return segments.join("/");
    }

    // Fallback to replace only the locale
    segments[1] = locale;
    return segments.join("/");
  };

  return (
    <div className="flex gap-2 p-1 rounded-md">
      {!pathname.includes("/products/") && Object.keys(localizedSlugs).map((locale) => (
        <Link key={locale} href={generateLocalizedPath(locale)}>
          <div
            className={cn(
              "flex cursor-pointer items-center justify-center text-sm leading-[110%] w-8 py-1 rounded-md hover:bg-neutral-800 hover:text-white/80 text-white hover:shadow-[0px_1px_0px_0px_var(--neutral-600)_inset] transition duration-200",
              locale === currentLocale
                ? "bg-neutral-800 text-white shadow-[0px_1px_0px_0px_var(--neutral-600)_inset]"
                : ""
            )}
          >
            {locale}
          </div>
        </Link>
      ))}
    </div>
  );
}
