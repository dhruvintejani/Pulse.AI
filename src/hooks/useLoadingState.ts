import { useCallback, useMemo, useState } from 'react';
import { normalizeApiError } from '@/services/api';
import type { ApiError } from '@/services/api';

export type LoadingStatus = 'idle' | 'loading' | 'success' | 'error';

export const useLoadingState = () => {
  const [status, setStatus] = useState<LoadingStatus>('idle');
  const [error, setError] = useState<ApiError | null>(null);

  const start = useCallback(() => {
    setStatus('loading');
    setError(null);
  }, []);

  const succeed = useCallback(() => {
    setStatus('success');
    setError(null);
  }, []);

  const fail = useCallback((unknownError: unknown) => {
    setStatus('error');
    setError(normalizeApiError(unknownError));
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
  }, []);

  return useMemo(() => ({
    error,
    fail,
    isError: status === 'error',
    isIdle: status === 'idle',
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    reset,
    start,
    status,
    succeed,
  }), [error, fail, reset, start, status, succeed]);
};
