import { useAuth } from '@clerk/clerk-react';
import { useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { env } from '@/config/env';
import { clearApiTokenProvider, setApiTokenProvider } from '@/services/api';

export const useApiAuth = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const getAccessToken = useCallback(async () => {
    if (!isSignedIn) return null;
    return getToken(env.clerkJwtTemplate ? { template: env.clerkJwtTemplate } : undefined);
  }, [getToken, isSignedIn]);

  const getAuthHeaders = useCallback(async () => {
    const token = await getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [getAccessToken]);

  useEffect(() => {
    setApiTokenProvider(getAccessToken);
    return clearApiTokenProvider;
  }, [getAccessToken]);

  return {
    isAuthLoaded: isLoaded,
    isAuthenticated: Boolean(isSignedIn),
    getAccessToken,
    getAuthHeaders,
  };
};

interface ApiAuthProviderProps {
  children: ReactNode;
}

export const ApiAuthProvider = ({ children }: ApiAuthProviderProps) => {
  useApiAuth();
  return <>{children}</>;
};
