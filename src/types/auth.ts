export type OAuthStrategy = 'oauth_google' | 'oauth_github';

export type FieldErrors = Record<string, string>;

export interface AuthEmailState {
  email?: string;
}
