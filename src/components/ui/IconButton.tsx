import { forwardRef, memo } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: ReactNode;
  active?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-9 h-9',
  lg: 'w-10 h-10',
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
  label,
  icon,
  active,
  size = 'md',
  className,
  type = 'button',
  disabled,
  ...props
}, ref) => (
  <button
    ref={ref}
    type={type}
    disabled={disabled}
    aria-label={label}
    aria-pressed={active ?? undefined}
    className={cn(
      'inline-flex shrink-0 items-center justify-center rounded-xl text-[#999] transition-all duration-200 hover:bg-[rgba(0,0,0,0.04)] hover:text-[#666] disabled:cursor-not-allowed disabled:opacity-50 focus-ring motion-reduce:transition-none',
      sizes[size],
      active && 'text-[#E9A24C] bg-[rgba(233,162,76,0.08)]',
      className
    )}
    {...props}
  >
    <span aria-hidden="true">{icon}</span>
  </button>
));

IconButton.displayName = 'IconButton';

export default memo(IconButton);
