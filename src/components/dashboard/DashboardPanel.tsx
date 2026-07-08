import { memo } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardPanelProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

const DashboardPanel = ({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
  titleClassName,
  descriptionClassName,
}: DashboardPanelProps) => (
  <section className={cn('bg-[#FFFDF8] rounded-2xl p-5 border border-[rgba(0,0,0,0.05)] shadow-card', className)}>
    <div className="flex items-start justify-between gap-4 mb-4">
      <div>
        <h2 className={cn('text-sm font-bold', titleClassName ?? 'text-[#1F1F1F]')}>{title}</h2>
        {description && <p className={cn('text-xs mt-1', descriptionClassName ?? 'text-[#999]')}>{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
    <div className={contentClassName}>{children}</div>
  </section>
);

export default memo(DashboardPanel);
