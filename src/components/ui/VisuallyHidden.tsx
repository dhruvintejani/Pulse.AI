import { memo } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface VisuallyHiddenProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

const VisuallyHidden = ({ children, className, ...props }: VisuallyHiddenProps) => (
  <span className={cn('ds-visually-hidden', className)} {...props}>
    {children}
  </span>
);

export default memo(VisuallyHidden);
