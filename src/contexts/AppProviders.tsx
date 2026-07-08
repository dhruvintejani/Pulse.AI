import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';
import { AUTH_REDIRECTS } from '@/constants/auth';
import { ROUTES } from '@/constants/routes';
import { CurrentUserProvider } from '@/contexts/CurrentUserContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ApiAuthProvider } from '@/hooks/useApiAuth';
import { queryClient } from '@/lib/queryClient';

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY');
}

interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => (
  <ClerkProvider
    publishableKey={clerkPublishableKey}
    signInUrl={ROUTES.LOGIN}
    signUpUrl={ROUTES.SIGNUP}
    afterSignOutUrl={AUTH_REDIRECTS.afterSignOut}
  >
    <ApiAuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <MotionConfig reducedMotion="user">
            <CurrentUserProvider>
              <SidebarProvider>{children}</SidebarProvider>
            </CurrentUserProvider>
          </MotionConfig>
        </ThemeProvider>
      </QueryClientProvider>
    </ApiAuthProvider>
  </ClerkProvider>
);

export default AppProviders;
