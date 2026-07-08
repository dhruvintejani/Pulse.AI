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
}

const DashboardPanel = ({ title, description, action, children, className, contentClassName }: DashboardPanelProps) => (
  <section className={cn('bg-[#FFFDF8] rounded-2xl p-5 border border-[rgba(0,0,0,0.05)] shadow-card', className)}>
    <div className="flex items-start justify-between gap-4 mb-4">
      <div>
        <h2 className="text-sm font-bold text-[#1F1F1F]">{title}</h2>
        {description && <p className="text-xs text-[#999] mt-1">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
    <div className={contentClassName}>{children}</div>
  </section>
);

export default memo(DashboardPanel);
