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
            gcTime: 5 * 60 * 1000, // 5 minutes
            retry: (failureCount, error) => {
              // Ne pas retry sur les erreurs 404
              if (error instanceof Error && error.message.includes('404')) {
                return false;
              }
              return failureCount < 2;
            },
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
