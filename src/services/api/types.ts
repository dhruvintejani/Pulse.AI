import type { AxiosRequestConfig } from 'axios';

export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export interface ApiResponse<TData> {
  success: boolean;
  data: TData;
  message?: string;
  requestId?: string;
}

export interface ApiErrorResponse<TDetails = unknown> {
  success: false;
  message: string;
  code: ApiErrorCode;
  status?: number;
  details?: TDetails;
  requestId?: string;
}

export interface PaginationRequest {
  page?: number;
  pageSize?: number;
}

export interface SortRequest {
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface SearchRequest {
  search?: string;
}

export type ListRequest<TFilters extends Record<string, unknown> = Record<string, unknown>> =
  PaginationRequest & SortRequest & SearchRequest & {
    filters?: TFilters;
  };

export interface PaginatedResponse<TItem> {
  items: TItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type ApiRequestConfig = AxiosRequestConfig & {
  skipAuth?: boolean;
};

export interface AuthenticatedRequest {
  accessToken?: string | null;
}
