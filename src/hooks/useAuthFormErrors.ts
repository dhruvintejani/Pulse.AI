import { useState } from 'react';
import type { FieldErrors } from '@/types/auth';

export const useAuthFormErrors = () => {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [authError, setAuthError] = useState('');

  const clearFieldError = (field: string) => {
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const clearErrors = () => {
    setFieldErrors({});
    setAuthError('');
  };

  return {
    fieldErrors,
    setFieldErrors,
    authError,
    setAuthError,
    clearFieldError,
    clearErrors,
  };
};
