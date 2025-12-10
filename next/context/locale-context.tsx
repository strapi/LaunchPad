'use client';

import { createContext, useState } from 'react';
import type { ReactNode } from 'react';

type LocaleContextType = {
  locales: string[];
  setLocales: (locales: string[]) => void;
};

export const LocaleContext = createContext<LocaleContextType | undefined>(
  undefined
);

export default function LocaleProvider({ children }: { children: ReactNode }) {
  const [locales, setLocales] = useState<string[]>([]);

  return (
    <LocaleContext.Provider value={{ locales, setLocales }}>
      {children}
    </LocaleContext.Provider>
  );
}
