import { memo } from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

const Skeleton = memo(({ className }: SkeletonProps) => (
  <div
    className={cn(
      'skeleton-premium relative overflow-hidden rounded-xl bg-[rgba(0,0,0,0.06)] before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/45 before:to-transparent motion-reduce:before:animate-none dark:bg-[rgba(255,255,255,0.08)]',
      className
    )}
    aria-hidden="true"
  />
));

Skeleton.displayName = 'Skeleton';

export const SkeletonLine = memo(({ className }: SkeletonProps) => (
  <Skeleton className={cn('h-3 w-full', className)} />
));

SkeletonLine.displayName = 'SkeletonLine';

export default Skeleton;
