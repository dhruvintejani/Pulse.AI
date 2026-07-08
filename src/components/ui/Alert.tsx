import { forwardRef, memo } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

type AlertVariant = 'info' | 'success' | 'warning' | 'error' | 'neutral';

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
}

const variants: Record<AlertVariant, string> = {
  info: 'border-[rgba(59,130,246,0.22)] bg-[rgba(59,130,246,0.08)] text-blue-700',
  success: 'border-[rgba(34,197,94,0.24)] bg-[var(--ds-color-success-soft)] text-[var(--ds-color-success)]',
  warning: 'border-[rgba(245,158,11,0.26)] bg-[var(--ds-color-warning-soft)] text-[var(--ds-color-warning)]',
  error: 'border-[rgba(239,68,68,0.24)] bg-[var(--ds-color-danger-soft)] text-[var(--ds-color-danger)]',
  neutral: 'border-[var(--ds-color-border)] bg-[var(--ds-color-surface-muted)] text-[var(--ds-color-muted)]',
};

const defaultIcons: Record<AlertVariant, ReactNode> = {
  info: <Info size={18} aria-hidden="true" />,
  success: <CheckCircle2 size={18} aria-hidden="true" />,
  warning: <TriangleAlert size={18} aria-hidden="true" />,
  error: <AlertCircle size={18} aria-hidden="true" />,
  neutral: <Info size={18} aria-hidden="true" />,
};

const Alert = forwardRef<HTMLDivElement, AlertProps>(({
  variant = 'info',
  title,
  description,
  icon,
  action,
  children,
  className,
  role,
  ...props
}, ref) => {
  const liveRole = role ?? (variant === 'error' || variant === 'warning' ? 'alert' : 'status');

  return (
    <div
      ref={ref}
      role={liveRole}
      className={cn('flex min-w-0 gap-3 rounded-2xl border p-4 text-sm shadow-[var(--ds-shadow-xs)]', variants[variant], className)}
      {...props}
    >
      <div className="mt-0.5 shrink-0">{icon ?? defaultIcons[variant]}</div>
      <div className="min-w-0 flex-1">
        {title && <p className="font-bold leading-5 text-[var(--ds-color-text)]">{title}</p>}
        {description && <p className="mt-1 leading-relaxed text-current opacity-90">{description}</p>}
        {children}
      </div>
      {action && <div className="shrink-0 self-start">{action}</div>}
    </div>
  );
});

Alert.displayName = 'Alert';
export default memo(Alert);
