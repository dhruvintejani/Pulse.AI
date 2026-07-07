import { useQuery } from '@tanstack/react-query';
import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';
import type { ApiError } from '@/services/api';

type ApiQueryOptions<TData> = Omit<
  UseQueryOptions<TData, ApiError, TData, QueryKey>,
  'queryKey' | 'queryFn'
>;

export const useApiQuery = <TData>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  options?: ApiQueryOptions<TData>
) => useQuery<TData, ApiError, TData, QueryKey>({
  queryKey,
  queryFn,
  retry: (failureCount, error) => {
    if (error.status && error.status >= 400 && error.status < 500) return false;
    return failureCount < 2;
  },
  ...options,
});
