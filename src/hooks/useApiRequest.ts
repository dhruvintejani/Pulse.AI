import { useCallback, useState } from 'react';
import { normalizeApiError } from '@/services/api';
import type { ApiError } from '@/services/api';

export const useApiRequest = <TArgs extends unknown[], TResult>(
  request: (...args: TArgs) => Promise<TResult>
) => {
  const [data, setData] = useState<TResult | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const execute = useCallback(async (...args: TArgs) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await request(...args);
      setData(result);
      return result;
    } catch (unknownError) {
      const apiError = normalizeApiError(unknownError);
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, [request]);

  return {
    data,
    error,
    execute,
    isError: Boolean(error),
    isLoading,
    reset,
  };
};
