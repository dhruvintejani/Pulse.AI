import { ClerkProvider } from '@clerk/clerk-react';
import type { ReactNode } from 'react';
import { AUTH_REDIRECTS } from '@/constants/auth';

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY');
}

interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => (
  <ClerkProvider publishableKey={clerkPublishableKey} afterSignOutUrl={AUTH_REDIRECTS.afterSignOut}>
    {children}
  </ClerkProvider>
);

export default AppProviders;
