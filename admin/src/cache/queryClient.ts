import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes (default offline-friendly stale time)
      gcTime: 1000 * 60 * 60 * 24, // 24 hours (keep cache around for offline use)
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 2,
    },
    mutations: {
      retry: 2,
    }
  },
});
