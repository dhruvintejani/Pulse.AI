import { memo } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

const variants = {
  default: 'bg-[#F0EAE0] text-[#7A5524] border-[rgba(233,162,76,0.24)]',
  accent: 'bg-[var(--ds-color-accent-soft)] text-[var(--ds-color-accent-strong)] border-[rgba(233,162,76,0.32)]',
  success: 'bg-[var(--ds-color-success-soft)] text-[var(--ds-color-success)] border-[rgba(34,197,94,0.24)]',
  warning: 'bg-[var(--ds-color-warning-soft)] text-[var(--ds-color-warning)] border-[rgba(234,179,8,0.24)]',
  error: 'bg-[var(--ds-color-danger-soft)] text-[var(--ds-color-danger)] border-[rgba(239,68,68,0.24)]',
  neutral: 'bg-[var(--ds-color-surface-muted)] text-[var(--ds-color-muted)] border-[var(--ds-color-border)]',
};

const sizes = {
  sm: 'px-2 py-0.5 text-[10px] gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
};

const dotColors = {
  default: 'bg-[#E9A24C]',
  accent: 'bg-[#E9A24C]',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
  neutral: 'bg-gray-400',
};

const Badge = ({ children, variant = 'default', size = 'md', className, dot }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex max-w-full items-center rounded-full border font-bold leading-none whitespace-nowrap align-middle transition-colors duration-200 motion-reduce:transition-none',
      variants[variant],
      sizes[size],
      className
    )}
  >
    {dot && <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', dotColors[variant])} aria-hidden="true" />}
    <span className="min-w-0 truncate">{children}</span>
  </span>
);

export default memo(Badge);
