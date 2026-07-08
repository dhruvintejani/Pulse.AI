const numberFromEnv = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const booleanFromEnv = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) return fallback;
  return value === 'true';
};

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export const env = {
  apiBaseUrl: trimTrailingSlash(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'),
  apiVersion: import.meta.env.VITE_API_VERSION || 'v1',
  apiTimeoutMs: numberFromEnv(import.meta.env.VITE_API_TIMEOUT_MS, 30000),
  apiRetryCount: numberFromEnv(import.meta.env.VITE_API_RETRY_COUNT, 1),
  apiWithCredentials: booleanFromEnv(import.meta.env.VITE_API_WITH_CREDENTIALS, false),
  clerkPublishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  clerkJwtTemplate: import.meta.env.VITE_CLERK_JWT_TEMPLATE || undefined,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;
