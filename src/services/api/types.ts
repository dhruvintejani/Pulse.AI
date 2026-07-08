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
  | 'TIMEOUT_ERROR'
  | 'CANCELLED'
  | 'UNKNOWN_ERROR';

export interface ApiMeta {
  requestId?: string;
  timestamp?: string;
  version?: string;
}

export interface ApiResponse<TData> {
  success: boolean;
  data: TData;
  message?: string;
  requestId?: string;
  meta?: ApiMeta;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
  type?: string;
}

export interface ApiErrorResponse<TDetails = unknown> {
  success: false;
  message: string;
  code: ApiErrorCode;
  status?: number;
  details?: TDetails;
  errors?: ApiErrorDetail[];
  requestId?: string;
}

export interface FastApiValidationErrorItem {
  loc: Array<string | number>;
  msg: string;
  type: string;
  input?: unknown;
}

export interface FastApiValidationErrorResponse {
  detail: FastApiValidationErrorItem[];
}

export interface PaginationRequest {
  page?: number;
  pageSize?: number;
  limit?: number;
  offset?: number;
}

export interface SortRequest {
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface SearchRequest {
  search?: string;
  query?: string;
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

export interface CursorPaginatedResponse<TItem> {
  items: TItem[];
  nextCursor?: string | null;
  previousCursor?: string | null;
  hasMore: boolean;
}

export type ApiRequestConfig = AxiosRequestConfig & {
  skipAuth?: boolean;
  requestId?: string;
};

export interface AuthenticatedRequest {
  accessToken?: string | null;
}

export interface UploadProgress {
  loaded: number;
  total?: number;
  percent: number;
}
