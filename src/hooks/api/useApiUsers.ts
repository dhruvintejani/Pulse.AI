import { useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/services/api';
import { queryKeys } from '@/constants/queryKeys';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useApiQuery } from '@/hooks/useApiQuery';
import type { UpdateProfileRequest } from '@/types/api';

export const useApiUserProfile = (enabled = false) => useApiQuery(
  queryKeys.api.authUser,
  () => usersApi.getCurrentUser(),
  { enabled }
);

export const useUpdateApiProfile = () => {
  const queryClient = useQueryClient();
  return useApiMutation(
    (request: UpdateProfileRequest) => usersApi.updateProfile(request),
    { onSuccess: () => void queryClient.invalidateQueries({ queryKey: queryKeys.api.authUser }) }
  );
};

export const useUploadApiAvatar = () => {
  const queryClient = useQueryClient();
  return useApiMutation(
    (file: File) => usersApi.uploadAvatar(file),
    { onSuccess: () => void queryClient.invalidateQueries({ queryKey: queryKeys.api.authUser }) }
  );
};
