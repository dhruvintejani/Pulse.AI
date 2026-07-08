import { memo, useMemo } from 'react';
import { cn } from '@/lib/utils';
import OptimizedImage from '@/components/ui/OptimizedImage';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  online?: boolean;
}

const sizes = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-xl',
};

const dotSizes = {
  xs: 'h-1.5 w-1.5 -bottom-0 -right-0',
  sm: 'h-2 w-2 -bottom-0.5 -right-0.5',
  md: 'h-2.5 w-2.5 bottom-0 right-0',
  lg: 'h-3 w-3 bottom-0 right-0',
  xl: 'h-4 w-4 bottom-0.5 right-0.5',
};

const getInitials = (value: string) => {
  const parts = value.trim().split(' ').filter(Boolean);
  return parts.length > 1
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : value.slice(0, 2).toUpperCase();
};

const Avatar = ({ src, name, size = 'md', className, online }: AvatarProps) => {
  const initials = useMemo(() => (name ? getInitials(name) : 'AI'), [name]);
  const label = name ? `${name}${online === true ? ', online' : online === false ? ', offline' : ''}` : 'Pulse AI avatar';

  return (
    <div className={cn('relative inline-flex shrink-0', className)} aria-label={label} role="img" title={name}>
      <div
        className={cn(
          'flex items-center justify-center overflow-hidden rounded-full font-black shadow-[var(--ds-shadow-xs)] ring-2 ring-[var(--ds-color-surface)]',
          sizes[size],
          !src && 'bg-gradient-to-br from-[#E9A24C] to-[#D4853A] text-white'
        )}
      >
        {src ? (
          <OptimizedImage
            src={src}
            alt=""
            sizes="64px"
            className="h-full w-full object-cover"
            eager={size === 'xl'}
          />
        ) : (
          <span aria-hidden="true">{initials}</span>
        )}
      </div>
      {online !== undefined && (
        <span
          className={cn(
            'absolute rounded-full border-2 border-[var(--ds-color-bg)]',
            dotSizes[size],
            online ? 'bg-green-500' : 'bg-gray-400'
          )}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default memo(Avatar);
