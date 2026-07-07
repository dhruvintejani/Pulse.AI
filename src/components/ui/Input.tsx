import { cn } from '@/lib/utils';
import { forwardRef, memo, useCallback, useId, useState } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  iconRight?: ReactNode;
  showPasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  iconRight,
  showPasswordToggle,
  className,
  type,
  id,
  ...props
}, ref) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
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
          className="block text-sm font-medium text-[#1F1F1F]"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666666]" aria-hidden="true">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : props['aria-describedby']}
          className={cn(
            'input-premium w-full rounded-xl px-4 py-3 text-sm text-[#1F1F1F] placeholder:text-[#999]',
            icon && 'pl-10',
            (iconRight || showPasswordToggle) && 'pr-10',
            error && 'border-red-400 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]',
            className
          )}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#666] transition-colors focus-ring rounded-md"
          >
            {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
          </button>
        )}
        {iconRight && !showPasswordToggle && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#666]" aria-hidden="true">
            {iconRight}
          </div>
        )}
      </div>
      {error && (
        <p id={errorId} className="text-xs text-red-500 flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-red-100 flex items-center justify-center text-red-500 shrink-0" aria-hidden="true">!</span>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default memo(Input);
