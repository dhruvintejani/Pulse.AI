import { healthApi } from '@/services/api';
import { queryKeys } from '@/constants/queryKeys';
import { useApiQuery } from '@/hooks/useApiQuery';

export const useApiHealth = (enabled = false) => useApiQuery(
  queryKeys.api.health,
  healthApi.getHealth,
  { enabled }
);
