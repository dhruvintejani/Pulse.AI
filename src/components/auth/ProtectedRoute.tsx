import { useAuth } from '@clerk/clerk-react';
import { memo, useMemo } from 'react';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthLoadingScreen from './AuthLoadingScreen';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();
  const redirectState = useMemo(() => ({ from: location }), [location]);

  if (!isLoaded) return <AuthLoadingScreen />;

  if (!isSignedIn) {
    return <Navigate to="/login" replace state={redirectState} />;
  }

  return children;
};

export default memo(ProtectedRoute);
