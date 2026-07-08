/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
  readonly VITE_CLERK_JWT_TEMPLATE?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_API_VERSION?: string;
  readonly VITE_API_PREFIX?: string;
  readonly VITE_API_TIMEOUT_MS?: string;
  readonly VITE_API_RETRY_COUNT?: string;
  readonly VITE_API_WITH_CREDENTIALS?: string;
  readonly VITE_ADMIN_EMAILS?: string;
  readonly VITE_APP_ENV?: string;
  readonly VITE_ENABLE_SOURCEMAPS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
