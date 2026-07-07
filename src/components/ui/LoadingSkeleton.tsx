import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('skeleton', className)} />
);

export const ChatSkeleton = () => (
  <div className="space-y-6 p-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className={cn('flex gap-3', i % 2 === 0 && 'flex-row-reverse')}>
        <Skeleton className="w-8 h-8 rounded-full shrink-0" />
        <div className="space-y-2 flex-1 max-w-[70%]">
          <Skeleton className={cn('h-4', i % 2 === 0 ? 'w-3/4 ml-auto' : 'w-1/4')} />
          <Skeleton className="h-16 w-full rounded-2xl" />
          {i === 2 && <Skeleton className="h-4 w-1/2" />}
        </div>
      </div>
    ))}
  </div>
);

export const CardSkeleton = ({ count = 3 }: SkeletonProps) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-[#FFFDF8] rounded-2xl p-4 border border-[rgba(0,0,0,0.05)] space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    ))}
  </div>
);

export const TableSkeleton = () => (
  <div className="space-y-2">
    <div className="flex gap-4 pb-2 border-b border-[rgba(0,0,0,0.06)]">
      {[40, 25, 20, 15].map((w, i) => (
        <Skeleton key={i} className={`h-3 flex-[${w}]`} />
      ))}
    </div>
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex gap-4 py-2">
        <Skeleton className="h-4 flex-[40]" />
        <Skeleton className="h-4 flex-[25]" />
        <Skeleton className="h-4 flex-[20]" />
        <Skeleton className="h-4 flex-[15]" />
      </div>
    ))}
  </div>
);

export default Skeleton;
