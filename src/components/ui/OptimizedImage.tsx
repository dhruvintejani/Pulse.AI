import { memo, useCallback, useState } from 'react';
import type { ImgHTMLAttributes, SyntheticEvent } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'loading' | 'decoding'> {
  eager?: boolean;
  fallbackClassName?: string;
}

const OptimizedImage = ({
  alt,
  className,
  eager = false,
  fallbackClassName,
  sizes = '100vw',
  onLoad,
  ...props
}: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = useCallback((event: SyntheticEvent<HTMLImageElement>) => {
    setLoaded(true);
    onLoad?.(event);
  }, [onLoad]);

  return (
    <img
      {...props}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : 'auto'}
      sizes={sizes}
      onLoad={handleLoad}
      className={cn(
        'transition-opacity duration-300',
        loaded ? 'opacity-100' : 'opacity-0',
        !loaded && fallbackClassName,
        className
      )}
    />
  );
};

export default memo(OptimizedImage);
