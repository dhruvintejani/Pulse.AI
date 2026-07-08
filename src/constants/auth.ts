import { ROUTES } from './routes';
import type { OAuthStrategy } from '@/types/auth';

export const AUTH_REDIRECTS = {
  afterAuth: ROUTES.DASHBOARD,
  afterSignOut: ROUTES.LOGIN,
  oauthCallback: ROUTES.SSO_CALLBACK,
} as const;

export const PASSWORD_MIN_LENGTH = 8;

export const LOGIN_DEFAULTS = {
  email: '',
  password: '',
} as const;

export const OAUTH_STRATEGIES = {
  google: 'oauth_google',
  github: 'oauth_github',
} satisfies Record<string, OAuthStrategy>;
