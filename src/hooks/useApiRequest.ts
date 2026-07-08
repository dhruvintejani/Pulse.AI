import { useCallback, useEffect, useRef, useState } from 'react';
import { normalizeApiError } from '@/services/api';
import type { ApiError } from '@/services/api';

export const useApiRequest = <TArgs extends unknown[], TResult>(
  request: (...args: TArgs) => Promise<TResult>
) => {
  const mountedRef = useRef(true);
  const [data, setData] = useState<TResult | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const reset = useCallback(() => {
    if (!mountedRef.current) return;
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const execute = useCallback(async (...args: TArgs) => {
    if (mountedRef.current) {
      setIsLoading(true);
      setError(null);
    }

    try {
      const result = await request(...args);
      if (mountedRef.current) setData(result);
      return result;
    } catch (unknownError) {
      const apiError = normalizeApiError(unknownError);
      if (mountedRef.current) setError(apiError);
      throw apiError;
    } finally {
      if (mountedRef.current) setIsLoading(false);
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
