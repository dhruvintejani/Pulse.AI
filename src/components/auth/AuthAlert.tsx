import { cn } from '@/lib/utils';

interface AuthAlertProps {
  message?: string;
  variant?: 'error' | 'success';
}

const variants = {
  error: 'border-red-200 bg-red-50/80 text-red-600',
  success: 'border-emerald-200 bg-emerald-50/80 text-emerald-700',
};

const AuthAlert = ({ message, variant = 'error' }: AuthAlertProps) => {
  if (!message) return null;

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      className={cn('rounded-2xl border px-4 py-3 text-sm shadow-sm', variants[variant])}
    >
      {message}
    </div>
  );
};

export default AuthAlert;
