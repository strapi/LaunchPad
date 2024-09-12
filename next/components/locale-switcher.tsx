import React from "react";

import { useLocale } from "next-intl";
import { Locale, locales } from "@/config";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({
  onChange,
}: {
  onChange: (locale: Locale) => void;
}) {
  const locale = useLocale();
  return (
    <div className="flex gap-2  p-1 rounded-md">
      {locales.map((cur, idx) => (
        <React.Fragment key={cur}>
          <div
            onClick={() => onChange(cur)}
            className={cn(
              "flex cursor-pointer items-center justify-center  text-sm leading-[110%] w-8 py-1 rounded-md  hover:bg-neutral-800 hover:text-white/80 text-white hover:shadow-[0px_1px_0px_0px_var(--neutral-600)_inset] transition duration-200",
              locale === cur
                ? "bg-neutral-800 text-white shadow-[0px_1px_0px_0px_var(--neutral-600)_inset]"
                : ""
            )}
          >
            {cur}
          </div>
          {idx < locales.length - 1 && (
            <span className="text-neutral-600"> / </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
