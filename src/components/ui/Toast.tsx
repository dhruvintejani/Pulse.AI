import { createContext, memo, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from './Button';

type ToastVariant = 'info' | 'success' | 'warning' | 'error';

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastInput {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toast: (input: ToastInput) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const variants = {
  info: 'border-[rgba(59,130,246,0.18)]',
  success: 'border-[rgba(34,197,94,0.22)]',
  warning: 'border-[rgba(245,158,11,0.24)]',
  error: 'border-[rgba(239,68,68,0.24)]',
};

const iconMap = {
  info: <Info size={18} className="text-blue-500" aria-hidden="true" />,
  success: <CheckCircle2 size={18} className="text-emerald-500" aria-hidden="true" />,
  warning: <AlertCircle size={18} className="text-amber-500" aria-hidden="true" />,
  error: <AlertCircle size={18} className="text-red-500" aria-hidden="true" />,
};

export const ToastProvider = memo(({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(({ title, description, variant = 'info', duration = 4200 }: ToastInput) => {
    const id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((current) => [{ id, title, description, variant }, ...current].slice(0, 5));
    if (duration > 0) window.setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  const value = useMemo(() => ({ toast, dismiss }), [dismiss, toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== 'undefined' && createPortal(
        <div className="fixed right-4 top-4 z-[120] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2" aria-live="polite" aria-relevant="additions removals">
          <AnimatePresence initial={false}>
            {toasts.map((item) => (
              <motion.div
                key={item.id}
                role={item.variant === 'error' || item.variant === 'warning' ? 'alert' : 'status'}
                layout
                initial={{ opacity: 0, x: 24, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className={cn('ds-card flex gap-3 p-4 shadow-[var(--ds-shadow-lg)]', variants[item.variant])}
              >
                <div className="mt-0.5 shrink-0">{iconMap[item.variant]}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-[var(--ds-color-text)]">{item.title}</p>
                  {item.description && <p className="mt-1 text-xs leading-relaxed text-[var(--ds-color-muted)]">{item.description}</p>}
                </div>
                <Button variant="ghost" size="sm" aria-label="Dismiss notification" onClick={() => dismiss(item.id)} className="-mr-2 -mt-1 px-2">
                  <X size={14} aria-hidden="true" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
});
ToastProvider.displayName = 'ToastProvider';

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
