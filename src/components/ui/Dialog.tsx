import { memo, useCallback, useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { cn } from '@/lib/utils';
import Button from './Button';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeLabel?: string;
  className?: string;
  preventOutsideClose?: boolean;
}

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

const Dialog = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeLabel = 'Close dialog',
  className,
  preventOutsideClose,
}: DialogProps) => {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);
  useEscapeKey(open, close);
  useFocusTrap(dialogRef, open);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex min-h-dvh items-center justify-center overflow-y-auto bg-black/28 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-hidden={!open}
        >
          <button
            type="button"
            aria-label={closeLabel}
            className="absolute inset-0 h-full w-full cursor-default focus:outline-none"
            onClick={() => !preventOutsideClose && close()}
            tabIndex={-1}
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descriptionId : undefined}
            tabIndex={-1}
            className={cn('ds-card relative z-10 max-h-[calc(100dvh-2rem)] w-full overflow-hidden p-0 shadow-[var(--ds-shadow-lg)]', sizes[size], className)}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[var(--ds-color-border)] px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <h2 id={titleId} className="ds-text-title text-lg leading-tight">{title}</h2>
                {description && <p id={descriptionId} className="mt-1 text-sm leading-relaxed text-[var(--ds-color-subtle)]">{description}</p>}
              </div>
              <Button variant="ghost" size="sm" aria-label={closeLabel} onClick={close} className="-mr-2 shrink-0 px-2">
                <X size={17} aria-hidden="true" />
              </Button>
            </div>
            <div className="ds-scrollbar max-h-[calc(100dvh-12rem)] overflow-y-auto px-5 py-4 sm:px-6">
              {children}
            </div>
            {footer && <div className="flex flex-col gap-3 border-t border-[var(--ds-color-border)] px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default memo(Dialog);
