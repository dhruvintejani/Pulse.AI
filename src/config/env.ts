const numberFromEnv = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  apiTimeoutMs: numberFromEnv(import.meta.env.VITE_API_TIMEOUT_MS, 30000),
  clerkPublishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  clerkJwtTemplate: import.meta.env.VITE_CLERK_JWT_TEMPLATE || undefined,
};
