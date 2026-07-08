import { memo } from 'react';
import type { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

const EmptyState = ({ title, description, icon, action, className }: EmptyStateProps) => (
  <div className={cn('flex flex-col items-center justify-center px-4 py-12 text-center', className)} role="status" aria-live="polite">
    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--ds-color-accent-soft)] text-[var(--ds-color-accent)] shadow-[var(--ds-shadow-xs)]" aria-hidden="true">
      {icon ?? <Sparkles size={18} />}
    </div>
    <p className="ds-text-title text-sm">{title}</p>
    {description && <p className="mt-1 max-w-sm text-sm leading-relaxed text-[var(--ds-color-subtle)] sm:text-xs">{description}</p>}
    {action && <div className="mt-4 flex flex-wrap justify-center gap-2">{action}</div>}
  </div>
);

export default memo(EmptyState);
