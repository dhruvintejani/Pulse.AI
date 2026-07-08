import { useMutation } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import type { ApiError } from '@/services/api';

type ApiMutationOptions<TData, TVariables> = Omit<
  UseMutationOptions<TData, ApiError, TVariables>,
  'mutationFn'
>;

type ApiMutationFn<TData, TVariables> = [TVariables] extends [void]
  ? (() => Promise<TData>) | ((variables: TVariables) => Promise<TData>)
  : (variables: TVariables) => Promise<TData>;

export const useApiMutation = <TData, TVariables = void>(
  mutationFn: ApiMutationFn<TData, TVariables>,
  options?: ApiMutationOptions<TData, TVariables>
) => useMutation<TData, ApiError, TVariables>({
  mutationFn: mutationFn as (variables: TVariables) => Promise<TData>,
  ...options,
});
