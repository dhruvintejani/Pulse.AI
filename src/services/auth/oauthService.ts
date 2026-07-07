import { AUTH_REDIRECTS } from '@/constants/auth';
import type { OAuthStrategy } from '@/types/auth';

type RedirectAuthenticator = {
  authenticateWithRedirect: (params: {
    strategy: OAuthStrategy;
    redirectUrl: string;
    redirectUrlComplete: string;
  }) => Promise<unknown>;
};

export const startOAuthRedirect = (authenticator: RedirectAuthenticator, strategy: OAuthStrategy) => {
  return authenticator.authenticateWithRedirect({
    strategy,
    redirectUrl: AUTH_REDIRECTS.oauthCallback,
    redirectUrlComplete: AUTH_REDIRECTS.afterAuth,
  });
};
