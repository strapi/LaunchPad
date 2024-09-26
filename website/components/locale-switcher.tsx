import React from "react";


import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { i18n } from '@/i18n.config'

import { cn } from "@/lib/utils";

export function LocaleSwitcher() {
  const pathName = usePathname()
  const currentLocale = pathName.split('/')[1]

  const redirectedPathName = (locale: string) => {
    if (!pathName) return '/'
    const segments = pathName.split('/')
    segments[1] = locale
    return segments.join('/')
  }

  return (
    <div className="flex gap-2  p-1 rounded-md">
      {i18n.locales.map((locale) => (
        <Link
          key={locale}
          href={redirectedPathName(locale)}
        >
          <React.Fragment >
            <div
              className={cn(
                "flex cursor-pointer items-center justify-center  text-sm leading-[110%] w-8 py-1 rounded-md  hover:bg-neutral-800 hover:text-white/80 text-white hover:shadow-[0px_1px_0px_0px_var(--neutral-600)_inset] transition duration-200",
                locale === currentLocale
                  ? "bg-neutral-800 text-white shadow-[0px_1px_0px_0px_var(--neutral-600)_inset]"
                  : ""
              )}
            >
              {locale}
            </div>
          </React.Fragment>
        </Link>
      ))}
    </div>
  );
}