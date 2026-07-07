import type { FieldErrors } from '@/types/auth';

type ClerkErrorItem = {
  message?: string;
  longMessage?: string;
  meta?: {
    paramName?: string;
  };
};

type ClerkErrorResponse = {
  errors?: ClerkErrorItem[];
  message?: string;
};

const fieldMap: Record<string, string> = {
  identifier: 'email',
  email_address: 'email',
  emailAddress: 'email',
  first_name: 'firstName',
  firstName: 'firstName',
  last_name: 'lastName',
  lastName: 'lastName',
  password: 'password',
  code: 'code',
};

const asClerkError = (error: unknown): ClerkErrorResponse => {
  if (typeof error === 'object' && error !== null) {
    return error as ClerkErrorResponse;
  }

  return {};
};

export const getClerkErrorMessage = (error: unknown, fallback = 'Something went wrong. Please try again.') => {
  const clerkError = asClerkError(error);
  const firstError = clerkError.errors?.[0];

  return firstError?.longMessage || firstError?.message || clerkError.message || fallback;
};

export const getClerkFieldErrors = (error: unknown) => {
  const clerkError = asClerkError(error);
  const fieldErrors: FieldErrors = {};

  clerkError.errors?.forEach((item) => {
    const fieldName = item.meta?.paramName ? fieldMap[item.meta.paramName] : undefined;
    const message = item.longMessage || item.message;

    if (fieldName && message) {
      fieldErrors[fieldName] = message;
    }
  });

  return fieldErrors;
};
