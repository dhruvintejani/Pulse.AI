import axios, { AxiosError } from 'axios';
import type { ApiErrorCode, ApiErrorResponse } from './types';

const statusToCode = (status?: number): ApiErrorCode => {
  if (!status) return 'NETWORK_ERROR';
  if (status === 400) return 'BAD_REQUEST';
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
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
  requestId?: string;

  constructor(error: ApiErrorResponse<TDetails>) {
    super(error.message);
    this.name = 'ApiError';
    this.code = error.code;
    this.status = error.status;
    this.details = error.details;
    this.requestId = error.requestId;
  }
}

const isApiErrorResponse = (value: unknown): value is Partial<ApiErrorResponse> => (
  typeof value === 'object' && value !== null && 'message' in value
);

export const normalizeApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<Partial<ApiErrorResponse>>;
    const status = axiosError.response?.status;
    const responseData = axiosError.response?.data;
    const requestId = axiosError.response?.headers?.['x-request-id'];

    return new ApiError({
      success: false,
      message: isApiErrorResponse(responseData) && responseData.message
        ? responseData.message
        : axiosError.message || 'Something went wrong while contacting the server.',
      code: responseData?.code ?? statusToCode(status),
      status,
      details: responseData?.details,
      requestId: typeof requestId === 'string' ? requestId : responseData?.requestId,
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
