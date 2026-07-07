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
  sm: 'w-7 h-7',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
  label,
  icon,
  active,
  size = 'md',
  className,
  type = 'button',
  ...props
}, ref) => (
  <button
    ref={ref}
    type={type}
    aria-label={label}
    aria-pressed={active ?? undefined}
    className={cn(
      'inline-flex items-center justify-center rounded-xl text-[#999] transition-all duration-200 hover:bg-[rgba(0,0,0,0.04)] hover:text-[#666] focus-ring',
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
