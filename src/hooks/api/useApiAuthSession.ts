import { useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/services/api';
import { queryKeys } from '@/constants/queryKeys';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useApiQuery } from '@/hooks/useApiQuery';
import type { AuthSessionRequest } from '@/types/api';

export const useApiCurrentUser = (enabled = false) => useApiQuery(
  queryKeys.api.authUser,
  authApi.getMe,
  { enabled }
);

export const useCreateApiSession = () => {
  const queryClient = useQueryClient();

  return useApiMutation(
    (request: AuthSessionRequest) => authApi.createSession(request),
    {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: queryKeys.api.authUser });
      },
    }
  );
};

export const useRefreshApiSession = () => useApiMutation(authApi.refreshSession);
export const useLogoutApiSession = () => useApiMutation(authApi.logout);
