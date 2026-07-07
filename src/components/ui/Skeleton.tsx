import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

const Skeleton = ({ className }: SkeletonProps) => (
  <div className={cn('animate-pulse rounded-xl bg-[rgba(0,0,0,0.06)]', className)} />
);

export const SkeletonLine = ({ className }: SkeletonProps) => (
  <Skeleton className={cn('h-3 w-full', className)} />
);

export default Skeleton;
