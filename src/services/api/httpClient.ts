import axios, { AxiosHeaders } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import { getApiAuthToken } from './authToken';
import { normalizeApiError } from './errors';
import type { ApiRequestConfig } from './types';

const createRequestId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `req_${Date.now()}_${Math.random().toString(36).slice(2)}`;
};

const ensureHeaders = (config: InternalAxiosRequestConfig) => {
  if (config.headers instanceof AxiosHeaders) return config.headers;
  config.headers = new AxiosHeaders(config.headers);
  return config.headers;
};

const applyAuthHeader = async (config: InternalAxiosRequestConfig) => {
  const apiConfig = config as InternalAxiosRequestConfig & Pick<ApiRequestConfig, 'skipAuth' | 'requestId'>;
  const headers = ensureHeaders(config);

  headers.set('X-Request-ID', apiConfig.requestId || createRequestId());
  headers.set('X-Client', 'pulse-ai-web');

  if (apiConfig.skipAuth) return config;

  const token = await getApiAuthToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  return config;
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
  (error) => Promise.reject(normalizeApiError(error))
);

export type { ApiRequestConfig };
