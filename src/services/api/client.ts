import type { AxiosResponse } from 'axios';
import { httpClient } from './httpClient';
import type { ApiRequestConfig, ApiResponse } from './types';

const isApiResponse = <TData>(payload: ApiResponse<TData> | TData): payload is ApiResponse<TData> => (
  typeof payload === 'object' &&
  payload !== null &&
  'success' in payload &&
  'data' in payload
);

export const unwrapApiResponse = <TData>(payload: ApiResponse<TData> | TData): TData => {
  if (isApiResponse(payload)) return payload.data;
  return payload;
};

const resolveResponse = <TData>(response: AxiosResponse<ApiResponse<TData> | TData>) => (
  unwrapApiResponse<TData>(response.data)
);

export const apiClient = {
  async get<TData>(url: string, config?: ApiRequestConfig) {
    return resolveResponse<TData>(await httpClient.get<ApiResponse<TData> | TData>(url, config));
  },

  async post<TData, TBody = unknown>(url: string, body?: TBody, config?: ApiRequestConfig) {
    return resolveResponse<TData>(await httpClient.post<ApiResponse<TData> | TData>(url, body, config));
  },

  async put<TData, TBody = unknown>(url: string, body?: TBody, config?: ApiRequestConfig) {
    return resolveResponse<TData>(await httpClient.put<ApiResponse<TData> | TData>(url, body, config));
  },

  async patch<TData, TBody = unknown>(url: string, body?: TBody, config?: ApiRequestConfig) {
    return resolveResponse<TData>(await httpClient.patch<ApiResponse<TData> | TData>(url, body, config));
  },

  async delete<TData>(url: string, config?: ApiRequestConfig) {
    return resolveResponse<TData>(await httpClient.delete<ApiResponse<TData> | TData>(url, config));
  },
};
