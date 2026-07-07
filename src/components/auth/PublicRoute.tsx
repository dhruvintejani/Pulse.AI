import { useAuth } from '@clerk/clerk-react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import AuthLoadingScreen from './AuthLoadingScreen';

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <AuthLoadingScreen />;

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
