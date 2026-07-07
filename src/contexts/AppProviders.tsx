import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { AUTH_REDIRECTS } from '@/constants/auth';
import { CurrentUserProvider } from '@/contexts/CurrentUserContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useApiAuth, ApiAuthProvider } from '@/hooks/useApiAuth';
import { queryClient } from '@/lib/queryClient';

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY');
}

interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => (
  <ClerkProvider publishableKey={clerkPublishableKey} afterSignOutUrl={AUTH_REDIRECTS.afterSignOut}>
    <ApiAuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <CurrentUserProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </CurrentUserProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ApiAuthProvider>
  </ClerkProvider>
);

export default AppProviders;
export { useApiAuth };
