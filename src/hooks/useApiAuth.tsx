import { useAuth } from '@clerk/clerk-react';
import { createContext, memo, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { env } from '@/config/env';
import { clearApiTokenProvider, setApiTokenProvider } from '@/services/api';

interface ApiAuthContextValue {
  getAccessToken: () => Promise<string | null>;
  getAuthHeaders: () => Promise<Record<string, string>>;
  isAuthLoaded: boolean;
  isAuthenticated: boolean;
}

const ApiAuthContext = createContext<ApiAuthContextValue | undefined>(undefined);

interface ApiAuthProviderProps {
  children: ReactNode;
}

const ApiAuthProviderComponent = ({ children }: ApiAuthProviderProps) => {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const getAccessToken = useMemo(() => async () => {
    if (!isLoaded || !isSignedIn) return null;
    return getToken(env.clerkJwtTemplate ? { template: env.clerkJwtTemplate } : undefined);
  }, [getToken, isLoaded, isSignedIn]);

  const getAuthHeaders = useMemo(() => async () => {
    const token = await getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [getAccessToken]);

  useEffect(() => {
    setApiTokenProvider(getAccessToken);
    return () => clearApiTokenProvider();
  }, [getAccessToken]);

  const value = useMemo<ApiAuthContextValue>(() => ({
    getAccessToken,
    getAuthHeaders,
    isAuthLoaded: isLoaded,
    isAuthenticated: Boolean(isSignedIn),
  }), [getAccessToken, getAuthHeaders, isLoaded, isSignedIn]);

  return <ApiAuthContext.Provider value={value}>{children}</ApiAuthContext.Provider>;
};

export const ApiAuthProvider = memo(ApiAuthProviderComponent);

export const useApiAuth = () => {
  const context = useContext(ApiAuthContext);
  if (!context) throw new Error('useApiAuth must be used within ApiAuthProvider');
  return context;
};
