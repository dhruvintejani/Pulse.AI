import { useMutation } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import type { ApiError } from '@/services/api';

type ApiMutationOptions<TData, TVariables> = Omit<
  UseMutationOptions<TData, ApiError, TVariables>,
  'mutationFn'
>;

export const useApiMutation = <TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: ApiMutationOptions<TData, TVariables>
) => useMutation<TData, ApiError, TVariables>({
  mutationFn,
  ...options,
});
