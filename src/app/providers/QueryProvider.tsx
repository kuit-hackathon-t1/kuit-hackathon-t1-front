import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

import { ApiError } from "@/shared/api/ApiError";

type QueryProviderProps = {
  children: ReactNode;
};

function logApiError(error: unknown) {
  if (error instanceof ApiError) {
    console.warn("[API Error]", {
      message: error.message,
      status: error.status,
      code: error.code,
      fieldErrors: error.fieldErrors,
    });
    return;
  }

  console.warn("[Query Error]", error);
}

export default function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: logApiError,
        }),
        mutationCache: new MutationCache({
          onError: logApiError,
        }),
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 1000 * 60,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
