import axios, { AxiosHeaders } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import { getApiAuthToken } from './authToken';
import { normalizeApiError } from './errors';
import type { ApiRequestConfig } from './types';

const applyAuthHeader = async (config: InternalAxiosRequestConfig) => {
  const apiConfig = config as InternalAxiosRequestConfig & Pick<ApiRequestConfig, 'skipAuth'>;
  if (apiConfig.skipAuth) return config;

  const token = await getApiAuthToken();
  if (!token) return config;

  if (config.headers instanceof AxiosHeaders) {
    config.headers.set('Authorization', `Bearer ${token}`);
  } else {
    config.headers = new AxiosHeaders(config.headers);
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
};

export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeoutMs,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

httpClient.interceptors.request.use(applyAuthHeader);
httpClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeApiError(error))
);

export type { ApiRequestConfig };
