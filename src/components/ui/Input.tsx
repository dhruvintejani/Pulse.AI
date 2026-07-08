import { cn } from '@/lib/utils';
import { forwardRef, memo, useCallback, useId, useState } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  icon?: ReactNode;
  iconRight?: ReactNode;
  showPasswordToggle?: boolean;
  hideLabel?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  description,
  error,
  icon,
  iconRight,
  showPasswordToggle,
  hideLabel,
  className,
  type,
  id,
  disabled,
  required,
  ...props
}, ref) => {
  const { 'aria-describedby': ariaDescribedBy, ...inputProps } = props;
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const descriptionId = `${inputId}-description`;
  const describedBy = [ariaDescribedBy, description ? descriptionId : undefined, error ? errorId : undefined].filter(Boolean).join(' ') || undefined;
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle && type === 'password'
    ? (showPassword ? 'text' : 'password')
    : type;

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((current) => !current);
  }, []);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className={cn('block text-sm font-semibold text-[var(--ds-color-text)]', hideLabel && 'sr-only')}
        >
          {label}{required && <span className="ml-1 text-red-500" aria-hidden="true">*</span>}
        </label>
      )}
      {description && <p id={descriptionId} className="text-xs leading-relaxed text-[var(--ds-color-subtle)]">{description}</p>}
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ds-color-muted)]" aria-hidden="true">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          disabled={disabled}
          required={required}
          aria-required={required || undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(
            'input-premium ds-control w-full px-4 py-3 text-sm placeholder:text-[var(--ds-color-subtle)] disabled:cursor-not-allowed disabled:opacity-60',
            icon && 'pl-10',
            (iconRight || showPasswordToggle) && 'pr-10',
            error && 'border-red-400 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]',
            className
          )}
          {...inputProps}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            disabled={disabled}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--ds-color-subtle)] transition-colors hover:bg-[var(--ds-color-accent-soft)] hover:text-[var(--ds-color-muted)] disabled:cursor-not-allowed disabled:opacity-50 ds-focus-ring"
          >
            {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
          </button>
        )}
        {iconRight && !showPasswordToggle && (
          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--ds-color-muted)]" aria-hidden="true">
            {iconRight}
          </div>
        )}
      </div>
      {error && (
        <p id={errorId} className="flex items-center gap-1.5 text-xs font-semibold text-red-500" role="alert">
          <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-500" aria-hidden="true">!</span>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default memo(Input);
