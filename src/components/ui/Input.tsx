import { cn } from '@/lib/utils';
import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
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
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle && type === 'password'
    ? (showPassword ? 'text' : 'password')
    : type;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-[#1F1F1F]"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666666]">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          id={id}
          type={inputType}
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
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#666] transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
        {iconRight && !showPasswordToggle && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#666]">
            {iconRight}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-red-100 flex items-center justify-center text-red-500 shrink-0">!</span>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
