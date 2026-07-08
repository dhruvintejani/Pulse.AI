import { cloneElement, isValidElement, memo, useId, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: ReactNode;
  children: ReactElement;
  side?: 'top' | 'bottom';
  className?: string;
}

const sideClasses = {
  top: 'bottom-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2',
  bottom: 'left-1/2 top-[calc(100%+0.5rem)] -translate-x-1/2',
};

const Tooltip = ({ content, children, side = 'top', className }: TooltipProps) => {
  const tooltipId = useId();
  const [open, setOpen] = useState(false);

  if (!isValidElement(children)) return children;

  const child = cloneElement(children, {
    'aria-describedby': open ? tooltipId : children.props['aria-describedby'],
    onFocus: (event: React.FocusEvent<HTMLElement>) => {
      children.props.onFocus?.(event);
      setOpen(true);
    },
    onBlur: (event: React.FocusEvent<HTMLElement>) => {
      children.props.onBlur?.(event);
      setOpen(false);
    },
    onMouseEnter: (event: React.MouseEvent<HTMLElement>) => {
      children.props.onMouseEnter?.(event);
      setOpen(true);
    },
    onMouseLeave: (event: React.MouseEvent<HTMLElement>) => {
      children.props.onMouseLeave?.(event);
      setOpen(false);
    },
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
      children.props.onKeyDown?.(event);
      if (event.key === 'Escape') setOpen(false);
    },
  });

  return (
    <span className="relative inline-flex">
      {child}
      <AnimatePresence>
        {open && (
          <motion.span
            id={tooltipId}
            role="tooltip"
            initial={{ opacity: 0, y: side === 'top' ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: side === 'top' ? 4 : -4 }}
            transition={{ duration: 0.14 }}
            className={cn('pointer-events-none absolute z-50 max-w-xs rounded-lg bg-[#1F1F1F] px-2.5 py-1.5 text-xs font-semibold leading-snug text-white shadow-[var(--ds-shadow-md)]', sideClasses[side], className)}
          >
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
};

export default memo(Tooltip);
