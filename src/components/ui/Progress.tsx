import { memo, useId } from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'accent' | 'success' | 'warning' | 'danger';
  className?: string;
}

const sizes = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-3.5',
};

const variants = {
  accent: 'from-[#E9A24C] to-[#D4853A]',
  success: 'from-emerald-500 to-green-500',
  warning: 'from-amber-500 to-orange-500',
  danger: 'from-red-500 to-rose-500',
};

const Progress = ({ value, max = 100, label, showValue, size = 'md', variant = 'accent', className }: ProgressProps) => {
  const labelId = useId();
  const safeMax = Math.max(max, 1);
  const safeValue = Math.min(Math.max(value, 0), safeMax);
  const percentage = Math.round((safeValue / safeMax) * 100);

  return (
    <div className={cn('w-full min-w-0', className)}>
      {(label || showValue) && (
        <div className="mb-2 flex items-center justify-between gap-3 text-xs font-bold text-[var(--ds-color-muted)]">
          {label && <span id={labelId}>{label}</span>}
          {showValue && <span aria-hidden="true">{percentage}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={safeValue}
        aria-valuetext={`${percentage}%`}
        aria-labelledby={label ? labelId : undefined}
        className={cn('overflow-hidden rounded-full bg-[rgba(0,0,0,0.08)]', sizes[size])}
      >
        <div
          className={cn('h-full rounded-full bg-gradient-to-r transition-[width] duration-500 ease-out motion-reduce:transition-none', variants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default memo(Progress);
