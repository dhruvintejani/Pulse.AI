import axios, { AxiosError } from 'axios';
import type {
  ApiErrorCode,
  ApiErrorDetail,
  ApiErrorResponse,
  FastApiValidationErrorResponse,
} from './types';

const statusToCode = (status?: number): ApiErrorCode => {
  if (!status) return 'NETWORK_ERROR';
  if (status === 400) return 'BAD_REQUEST';
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
  if (status === 408) return 'TIMEOUT_ERROR';
  if (status === 422) return 'VALIDATION_ERROR';
  if (status === 429) return 'RATE_LIMITED';
  if (status >= 500) return 'SERVER_ERROR';
  return 'UNKNOWN_ERROR';
};

export class ApiError<TDetails = unknown> extends Error implements ApiErrorResponse<TDetails> {
  success = false as const;
  code: ApiErrorCode;
  status?: number;
  details?: TDetails;
  errors?: ApiErrorDetail[];
  requestId?: string;

  constructor(error: ApiErrorResponse<TDetails>) {
    super(error.message);
    this.name = 'ApiError';
    this.code = error.code;
    this.status = error.status;
    this.details = error.details;
    this.errors = error.errors;
    this.requestId = error.requestId;
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const isApiErrorResponse = (value: unknown): value is Partial<ApiErrorResponse> => isRecord(value) && 'message' in value;

const isFastApiValidationError = (value: unknown): value is FastApiValidationErrorResponse => (
  isRecord(value) && Array.isArray(value.detail)
);

const normalizeFastApiErrors = (payload: FastApiValidationErrorResponse): ApiErrorDetail[] => (
  payload.detail.map((item) => ({
    field: item.loc.filter((segment) => segment !== 'body' && segment !== 'query' && segment !== 'path').join('.'),
    message: item.msg,
    type: item.type,
  }))
);

const getRequestId = (axiosError: AxiosError<unknown>) => {
  const headerRequestId = axiosError.response?.headers?.['x-request-id'];
  if (typeof headerRequestId === 'string') return headerRequestId;
  const responseData = axiosError.response?.data;
  if (isRecord(responseData) && typeof responseData.requestId === 'string') return responseData.requestId;
  if (isRecord(responseData) && typeof responseData.request_id === 'string') return responseData.request_id;
  return undefined;
};

export const normalizeApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) return error;

  if (axios.isCancel(error)) {
    return new ApiError({
      success: false,
      message: 'Request was cancelled.',
      code: 'CANCELLED',
    });
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<unknown>;
    const status = axiosError.response?.status;
    const responseData = axiosError.response?.data;
    const requestId = getRequestId(axiosError);

    if (isFastApiValidationError(responseData)) {
      const errors = normalizeFastApiErrors(responseData);
      return new ApiError({
        success: false,
        message: errors[0]?.message || 'Validation failed.',
        code: 'VALIDATION_ERROR',
        status,
        details: responseData,
        errors,
        requestId,
      });
    }

    if (isApiErrorResponse(responseData)) {
      return new ApiError({
        success: false,
        message: responseData.message || 'Something went wrong while contacting the server.',
        code: responseData.code ?? statusToCode(status),
        status,
        details: responseData.details,
        errors: responseData.errors,
        requestId,
      });
    }

    return new ApiError({
      success: false,
      message: axiosError.code === 'ECONNABORTED'
        ? 'The request timed out. Please try again.'
        : axiosError.message || 'Something went wrong while contacting the server.',
      code: axiosError.code === 'ECONNABORTED' ? 'TIMEOUT_ERROR' : statusToCode(status),
      status,
      details: responseData,
      requestId,
    });
  }

  if (error instanceof Error) {
    return new ApiError({
      success: false,
      message: error.message,
      code: 'UNKNOWN_ERROR',
    });
  }

  return new ApiError({
    success: false,
    message: 'An unknown error occurred.',
    code: 'UNKNOWN_ERROR',
  });
};

export const getApiErrorMessage = (error: unknown, fallback = 'Something went wrong.') => (
  normalizeApiError(error).message || fallback
);
