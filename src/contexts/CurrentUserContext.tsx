import { useUser } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { createContext, useMemo, type ReactNode } from 'react';
import { queryKeys } from '@/constants/queryKeys';
import { mapClerkUser } from '@/services/user/userService';
import type { CurrentUser } from '@/types/user';

interface CurrentUserContextValue {
  currentUser: CurrentUser | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export const CurrentUserContext = createContext<CurrentUserContextValue | undefined>(undefined);

interface CurrentUserProviderProps {
  children: ReactNode;
}

export const CurrentUserProvider = ({ children }: CurrentUserProviderProps) => {
  const { isLoaded, isSignedIn, user } = useUser();

  const currentUserQuery = useQuery({
    queryKey: [...queryKeys.currentUser, user?.id],
    enabled: isLoaded && isSignedIn && Boolean(user),
    queryFn: async () => {
      if (!user) return null;
      return mapClerkUser(user);
    },
  });

  const value = useMemo<CurrentUserContextValue>(() => ({
    currentUser: currentUserQuery.data ?? null,
    isLoading: !isLoaded || currentUserQuery.isLoading,
    isError: currentUserQuery.isError,
    error: currentUserQuery.error,
  }), [currentUserQuery.data, currentUserQuery.error, currentUserQuery.isError, currentUserQuery.isLoading, isLoaded]);

  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>;
};
