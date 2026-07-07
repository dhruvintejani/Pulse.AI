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
  <div className={cn('flex flex-col items-center justify-center text-center px-4 py-12', className)} role="status">
    <div className="w-10 h-10 rounded-2xl bg-[rgba(233,162,76,0.1)] text-[#E9A24C] flex items-center justify-center mb-3" aria-hidden="true">
      {icon ?? <Sparkles size={18} />}
    </div>
    <p className="text-sm font-bold text-[#1F1F1F]">{title}</p>
    {description && <p className="text-xs text-[#999] mt-1 max-w-xs">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default memo(EmptyState);
