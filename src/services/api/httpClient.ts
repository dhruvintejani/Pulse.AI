import axios, { AxiosHeaders } from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import { getApiAuthToken } from './authToken';
import { normalizeApiError } from './errors';
import type { ApiRequestConfig } from './types';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  __retryCount?: number;
}

const RETRYABLE_METHODS = new Set(['get', 'head', 'options']);
const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);

const createRequestId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `req_${Date.now()}_${Math.random().toString(36).slice(2)}`;
};

const delay = (milliseconds: number) => new Promise((resolve) => globalThis.setTimeout(resolve, milliseconds));

const ensureHeaders = (config: InternalAxiosRequestConfig) => {
  if (config.headers instanceof AxiosHeaders) return config.headers;
  config.headers = new AxiosHeaders(config.headers);
  return config.headers;
};

const isFormDataPayload = (data: unknown) => typeof FormData !== 'undefined' && data instanceof FormData;

const applyAuthHeader = async (config: InternalAxiosRequestConfig) => {
  const apiConfig = config as InternalAxiosRequestConfig & Pick<ApiRequestConfig, 'skipAuth' | 'requestId'>;
  const headers = ensureHeaders(config);

  headers.set('X-Request-ID', apiConfig.requestId || createRequestId());
  headers.set('X-Client', 'pulse-ai-web');

  if (isFormDataPayload(config.data)) {
    headers.delete('Content-Type');
  }

  if (apiConfig.skipAuth) return config;

  const token = await getApiAuthToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  return config;
};

const shouldRetryRequest = (error: AxiosError) => {
  const config = error.config as RetryableRequestConfig | undefined;
  if (!config || env.apiRetryCount <= 0) return false;

  const method = (config.method ?? 'get').toLowerCase();
  if (!RETRYABLE_METHODS.has(method)) return false;

  const currentRetryCount = config.__retryCount ?? 0;
  if (currentRetryCount >= env.apiRetryCount) return false;

  if (!error.response) return true;
  return RETRYABLE_STATUS_CODES.has(error.response.status);
};

const retryRequest = async (error: AxiosError) => {
  const config = error.config as RetryableRequestConfig;
  config.__retryCount = (config.__retryCount ?? 0) + 1;

  const backoffMs = Math.min(1200, 250 * 2 ** (config.__retryCount - 1));
  await delay(backoffMs);
  return httpClient(config);
};

export const httpClient = axios.create({
  baseURL: env.apiRootUrl,
  timeout: env.apiTimeoutMs,
  withCredentials: env.apiWithCredentials,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

httpClient.interceptors.request.use(applyAuthHeader);
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error) && shouldRetryRequest(error)) {
      return retryRequest(error);
    }

    return Promise.reject(normalizeApiError(error));
  }
);

export type { ApiRequestConfig };
