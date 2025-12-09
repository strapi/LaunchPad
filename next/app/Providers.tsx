// app/Providers.tsx
"use client";


import { ThemeProvider } from "next-themes";
import { PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";


export const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <ThemeProvider
     attribute="class"
      defaultTheme="light"
      forcedTheme="light"
    >
      
        <QueryClientProvider client={queryClient}>
          {/* <NuqsAdapter> */}
            {children}
          {/* </NuqsAdapter> */}
          <Toaster richColors />
        </QueryClientProvider>
      
    </ThemeProvider>
  );
};
