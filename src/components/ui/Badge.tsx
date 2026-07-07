import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

const Badge = ({ children, variant = 'default', size = 'md', className, dot }: BadgeProps) => {
  const variants = {
    default: 'bg-[#F0EAE0] text-[#8B6B3D] border-[rgba(233,162,76,0.2)]',
    accent: 'bg-[rgba(233,162,76,0.15)] text-[#C17F2A] border-[rgba(233,162,76,0.3)]',
    success: 'bg-[rgba(34,197,94,0.1)] text-[#16A34A] border-[rgba(34,197,94,0.2)]',
    warning: 'bg-[rgba(234,179,8,0.1)] text-[#B45309] border-[rgba(234,179,8,0.2)]',
    error: 'bg-[rgba(239,68,68,0.1)] text-[#DC2626] border-[rgba(239,68,68,0.2)]',
    neutral: 'bg-[rgba(0,0,0,0.04)] text-[#666] border-[rgba(0,0,0,0.08)]',
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

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />}
      {children}
    </span>
  );
};

export default Badge;
