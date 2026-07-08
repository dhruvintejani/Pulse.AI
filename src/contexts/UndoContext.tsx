import { createContext, memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Progress from '@/components/ui/Progress';

interface UndoActionInput {
  label: string;
  description?: string;
  duration?: number;
  onUndo: () => void;
}

interface UndoAction extends Required<UndoActionInput> {
  id: string;
  createdAt: number;
}

interface UndoContextValue {
  registerUndo: (action: UndoActionInput) => string;
  dismissUndo: (id: string) => void;
}

const UndoContext = createContext<UndoContextValue | null>(null);

const createId = () => (
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
);

const UndoToast = memo(({ action, onUndo, onDismiss }: { action: UndoAction; onUndo: () => void; onDismiss: () => void }) => {
  const [now, setNow] = useState(() => Date.now());
  const elapsed = Math.min(now - action.createdAt, action.duration);
  const remaining = Math.max(0, 100 - Math.round((elapsed / action.duration) * 100));

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 160);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 18, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="ds-card w-[min(28rem,calc(100vw-2rem))] overflow-hidden p-4 shadow-[var(--ds-shadow-lg)]"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--ds-color-accent-soft)] text-[var(--ds-color-accent)]">
          <RotateCcw size={16} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black text-[var(--ds-color-text)]">{action.label}</p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--ds-color-subtle)]">{action.description}</p>
        </div>
        <button type="button" aria-label="Dismiss undo" onClick={onDismiss} className="rounded-lg p-1.5 text-[var(--ds-color-subtle)] hover:bg-[var(--ds-color-accent-soft)] ds-focus-ring">
          <X size={14} aria-hidden="true" />
        </button>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <Progress value={remaining} size="sm" className="flex-1" />
        <Button variant="secondary" size="sm" icon={<RotateCcw size={13} />} onClick={onUndo}>Undo</Button>
      </div>
    </motion.div>
  );
});
UndoToast.displayName = 'UndoToast';

export const UndoProvider = memo(({ children }: { children: ReactNode }) => {
  const [actions, setActions] = useState<UndoAction[]>([]);

  const dismissUndo = useCallback((id: string) => {
    setActions((current) => current.filter((action) => action.id !== id));
  }, []);

  const registerUndo = useCallback((input: UndoActionInput) => {
    const id = createId();
    const action: UndoAction = {
      id,
      label: input.label,
      description: input.description ?? 'You can reverse this action for a few seconds.',
      duration: input.duration ?? 6500,
      onUndo: input.onUndo,
      createdAt: Date.now(),
    };

    setActions((current) => [action, ...current].slice(0, 3));
    window.setTimeout(() => dismissUndo(id), action.duration);
    return id;
  }, [dismissUndo]);

  const value = useMemo(() => ({ registerUndo, dismissUndo }), [dismissUndo, registerUndo]);

  return (
    <UndoContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 left-1/2 z-[130] flex -translate-x-1/2 flex-col gap-2 sm:bottom-6" aria-label="Undo actions">
        <AnimatePresence initial={false}>
          {actions.map((action) => (
            <UndoToast
              key={action.id}
              action={action}
              onDismiss={() => dismissUndo(action.id)}
              onUndo={() => {
                action.onUndo();
                dismissUndo(action.id);
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </UndoContext.Provider>
  );
});
UndoProvider.displayName = 'UndoProvider';

export const useUndoActions = () => {
  const context = useContext(UndoContext);
  if (!context) throw new Error('useUndoActions must be used within UndoProvider');
  return context;
};
