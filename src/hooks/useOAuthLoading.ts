import { useState } from 'react';
import type { OAuthStrategy } from '@/types/auth';

export const useOAuthLoading = () => {
  const [oauthLoading, setOauthLoading] = useState<OAuthStrategy | null>(null);

  return {
    oauthLoading,
    setOauthLoading,
    isOAuthLoading: oauthLoading !== null,
  };
};
