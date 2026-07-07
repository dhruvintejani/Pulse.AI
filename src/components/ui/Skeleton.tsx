import { memo } from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

const Skeleton = memo(({ className }: SkeletonProps) => (
  <div className={cn('animate-pulse rounded-xl bg-[rgba(0,0,0,0.06)]', className)} />
));

Skeleton.displayName = 'Skeleton';

export const SkeletonLine = memo(({ className }: SkeletonProps) => (
  <Skeleton className={cn('h-3 w-full', className)} />
));

SkeletonLine.displayName = 'SkeletonLine';

export default Skeleton;
