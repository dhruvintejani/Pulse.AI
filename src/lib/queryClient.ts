import { QueryClient } from '@tanstack/react-query';
import { env } from '@/config/env';
import type { ApiError } from '@/services/api';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: (failureCount, error) => {
        const apiError = error as ApiError | undefined;
        if (apiError?.status && apiError.status >= 400 && apiError.status < 500) return false;
        return failureCount < env.apiRetryCount;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
});
