import { PASSWORD_MIN_LENGTH } from '@/constants/auth';
import type { FieldErrors } from '@/types/auth';

export const isValidEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

export const validateEmail = (email: string, requiredMessage = 'Email address is required.') => {
  if (!email.trim()) return requiredMessage;
  if (!isValidEmail(email.trim())) return 'Enter a valid email address.';
  return '';
};

export const validatePassword = (password: string, requiredMessage = 'Password is required.') => {
  if (!password) return requiredMessage;
  if (password.length < PASSWORD_MIN_LENGTH) return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  return '';
};

export const hasErrors = (errors: FieldErrors) => Object.keys(errors).length > 0;
