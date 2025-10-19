import { QueryClient } from '@tanstack/react-query';

// QueryClient configuration with best practices
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data caching time (5 minutes)
      staleTime: 5 * 60 * 1000,
      // Cache lifetime (10 minutes)
      gcTime: 10 * 60 * 1000,
      // Retry attempts on error
      retry: (failureCount, error: any) => {
        // Don't retry for 4xx errors (except 408, 429)
        if (error?.status >= 400 && error?.status < 500) {
          if (error?.status === 408 || error?.status === 429) {
            return failureCount < 3;
          }
          return false; // Don't retry for 401, 403, 404, etc.
        }
        // Retry up to 3 times for other errors (5xx, network)
        return failureCount < 3;
      },
      // Interval between retry attempts
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus
      refetchOnWindowFocus: false,
      // Refetch on connection restore
      refetchOnReconnect: true,
    },
    mutations: {
      // Don't retry mutations automatically - too dangerous
      retry: false,
    },
  },
});
