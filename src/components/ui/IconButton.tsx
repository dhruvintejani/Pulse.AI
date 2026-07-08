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
  sm: 'h-9 w-9',
  md: 'h-10 w-10',
  lg: 'h-11 w-11',
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
      'inline-flex shrink-0 items-center justify-center rounded-xl text-[var(--ds-color-subtle)] transition-all duration-200 hover:bg-[var(--ds-color-accent-soft)] hover:text-[var(--ds-color-muted)] disabled:cursor-not-allowed disabled:opacity-50 ds-focus-ring motion-reduce:transition-none',
      sizes[size],
      active && 'bg-[var(--ds-color-accent-soft)] text-[var(--ds-color-accent)]',
      className
    )}
    {...props}
  >
    <span aria-hidden="true">{icon}</span>
  </button>
));

IconButton.displayName = 'IconButton';

export default memo(IconButton);
