export type ErrorSeverity = 'info' | 'warning' | 'error' | 'fatal';

export interface ErrorLogPayload {
  severity: ErrorSeverity;
  source: string;
  message: string;
  stack?: string;
  componentStack?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
  userAgent?: string;
  url?: string;
}

const errorLogEndpoint = import.meta.env.VITE_ERROR_LOG_ENDPOINT;

export const normalizeError = (error: unknown) => {
  if (error instanceof Error) {
    return {
      message: error.message || 'Unknown application error',
      stack: error.stack,
    };
  }

  if (typeof error === 'string') {
    return {
      message: error,
      stack: undefined,
    };
  }

  return {
    message: 'Unknown application error',
    stack: undefined,
  };
};

export const getFriendlyErrorMessage = (error: unknown) => {
  const { message } = normalizeError(error);
  const normalized = message.toLowerCase();

  if (normalized.includes('failed to fetch') || normalized.includes('networkerror') || normalized.includes('network')) {
    return 'We could not reach Pulse AI right now. Check your connection and try again.';
  }

  if (normalized.includes('timeout')) {
    return 'That request took longer than expected. Please retry in a moment.';
  }

  if (normalized.includes('unauthorized') || normalized.includes('forbidden')) {
    return 'Your session needs attention. Please sign in again to continue.';
  }

  if (normalized.includes('chunk') || normalized.includes('loading css') || normalized.includes('dynamic import')) {
    return 'A new version of Pulse AI is ready. Refresh the app to continue.';
  }

  return 'Pulse AI hit an unexpected state. Your workspace is safe, and you can retry.';
};

export const buildErrorPayload = ({
  error,
  source,
  severity = 'error',
  componentStack,
  metadata,
}: {
  error: unknown;
  source: string;
  severity?: ErrorSeverity;
  componentStack?: string;
  metadata?: Record<string, unknown>;
}): ErrorLogPayload => {
  const normalized = normalizeError(error);

  return {
    severity,
    source,
    message: normalized.message,
    stack: normalized.stack,
    componentStack,
    metadata,
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
  };
};

export const logApplicationError = (payload: ErrorLogPayload) => {
  if (import.meta.env.DEV) {
    console.error('[Pulse AI]', payload);
  }

  if (!errorLogEndpoint || typeof navigator === 'undefined') return;

  const body = JSON.stringify(payload);
  const blob = new Blob([body], { type: 'application/json' });

  if ('sendBeacon' in navigator && navigator.sendBeacon(errorLogEndpoint, blob)) return;

  void fetch(errorLogEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => undefined);
};

export const reportApplicationError = (input: {
  error: unknown;
  source: string;
  severity?: ErrorSeverity;
  componentStack?: string;
  metadata?: Record<string, unknown>;
}) => {
  const payload = buildErrorPayload(input);
  logApplicationError(payload);
  return payload;
};
