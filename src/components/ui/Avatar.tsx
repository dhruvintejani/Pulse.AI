import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  online?: boolean;
}

const Avatar = ({ src, name, size = 'md', className, online }: AvatarProps) => {
  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  const dotSizes = {
    xs: 'w-1.5 h-1.5 -bottom-0 -right-0',
    sm: 'w-2 h-2 -bottom-0.5 -right-0.5',
    md: 'w-2.5 h-2.5 bottom-0 right-0',
    lg: 'w-3 h-3 bottom-0 right-0',
    xl: 'w-4 h-4 bottom-0.5 right-0.5',
  };

  const getInitials = (n: string) => {
    const parts = n.trim().split(' ');
    return parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : n.slice(0, 2).toUpperCase();
  };

  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      <div
        className={cn(
          'rounded-full overflow-hidden flex items-center justify-center font-semibold',
          sizes[size],
          !src && 'bg-gradient-to-br from-[#E9A24C] to-[#D4853A] text-white'
        )}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{name ? getInitials(name) : 'AI'}</span>
        )}
      </div>
      {online !== undefined && (
        <span
          className={cn(
            'absolute rounded-full border-2 border-[#F8F4EC]',
            dotSizes[size],
            online ? 'bg-green-500' : 'bg-gray-400'
          )}
        />
      )}
    </div>
  );
};

export default Avatar;
