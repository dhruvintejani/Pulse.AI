import { createContext, memo, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Dialog from '@/components/ui/Dialog';

type ConfirmationTone = 'default' | 'danger' | 'success';

interface ConfirmationOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: ConfirmationTone;
}

interface PendingConfirmation extends Required<ConfirmationOptions> {
  resolve: (value: boolean) => void;
}

interface ConfirmationContextValue {
  confirm: (options: ConfirmationOptions) => Promise<boolean>;
}

const ConfirmationContext = createContext<ConfirmationContextValue | null>(null);

const toneIcon = {
  default: <AlertTriangle size={18} aria-hidden="true" />,
  danger: <Trash2 size={18} aria-hidden="true" />,
  success: <CheckCircle2 size={18} aria-hidden="true" />,
};

const toneClass = {
  default: 'bg-[var(--ds-color-accent-soft)] text-[var(--ds-color-accent)]',
  danger: 'bg-[var(--ds-color-danger-soft)] text-[var(--ds-color-danger)]',
  success: 'bg-[var(--ds-color-success-soft)] text-[var(--ds-color-success)]',
};

export const ConfirmationProvider = memo(({ children }: { children: ReactNode }) => {
  const [pending, setPending] = useState<PendingConfirmation | null>(null);

  const confirm = useCallback((options: ConfirmationOptions) => new Promise<boolean>((resolve) => {
    setPending({
      title: options.title,
      description: options.description ?? 'This action needs confirmation before continuing.',
      confirmLabel: options.confirmLabel ?? 'Confirm',
      cancelLabel: options.cancelLabel ?? 'Cancel',
      tone: options.tone ?? 'default',
      resolve,
    });
  }), []);

  const settle = useCallback((value: boolean) => {
    setPending((current) => {
      current?.resolve(value);
      return null;
    });
  }, []);

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmationContext.Provider value={value}>
      {children}
      <Dialog
        open={Boolean(pending)}
        onOpenChange={(open) => !open && settle(false)}
        title={pending?.title ?? 'Confirm action'}
        description={pending?.description}
        size="sm"
        footer={pending && (
          <>
            <Button variant="secondary" onClick={() => settle(false)}>{pending.cancelLabel}</Button>
            <Button variant={pending.tone === 'danger' ? 'danger' : 'primary'} onClick={() => settle(true)}>{pending.confirmLabel}</Button>
          </>
        )}
      >
        {pending && (
          <div className="flex items-start gap-3 rounded-2xl border border-[var(--ds-color-border)] bg-[var(--ds-color-surface-muted)] p-4">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${toneClass[pending.tone]}`}>
              {toneIcon[pending.tone]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[var(--ds-color-text)]">Are you sure?</p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--ds-color-muted)]">{pending.description}</p>
            </div>
          </div>
        )}
      </Dialog>
    </ConfirmationContext.Provider>
  );
});
ConfirmationProvider.displayName = 'ConfirmationProvider';

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (!context) throw new Error('useConfirmation must be used within ConfirmationProvider');
  return context;
};
