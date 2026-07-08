import { memo, useCallback, useMemo, useState } from 'react';
import type { ImgHTMLAttributes, SyntheticEvent } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'loading' | 'decoding'> {
  eager?: boolean;
  fallbackClassName?: string;
  fallbackSrc?: string;
}

const OptimizedImage = ({
  alt,
  className,
  eager = false,
  fallbackClassName,
  fallbackSrc,
  onError,
  onLoad,
  sizes = '100vw',
  src,
  ...props
}: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const resolvedSrc = useMemo(() => (failed && fallbackSrc ? fallbackSrc : src), [failed, fallbackSrc, src]);

  const handleLoad = useCallback((event: SyntheticEvent<HTMLImageElement>) => {
    setLoaded(true);
    onLoad?.(event);
  }, [onLoad]);

  const handleError = useCallback((event: SyntheticEvent<HTMLImageElement>) => {
    if (fallbackSrc && !failed) setFailed(true);
    setLoaded(true);
    onError?.(event);
  }, [failed, fallbackSrc, onError]);

  return (
    <img
      {...props}
      alt={alt ?? ''}
      src={resolvedSrc}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : 'auto'}
      sizes={sizes}
      onError={handleError}
      onLoad={handleLoad}
      className={cn(
        'transition-opacity duration-300 motion-reduce:transition-none',
        loaded ? 'opacity-100' : 'opacity-0',
        !loaded && fallbackClassName,
        className
      )}
    />
  );
};

export default memo(OptimizedImage);
