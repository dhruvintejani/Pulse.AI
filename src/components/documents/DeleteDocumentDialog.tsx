import { memo } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Dialog from '@/components/ui/Dialog';
import type { MockDocument } from '@/constants/mockData';

interface DeleteDocumentDialogProps {
  document: MockDocument | null;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteDocumentDialog = ({ document, onCancel, onConfirm }: DeleteDocumentDialogProps) => (
  <Dialog
    open={Boolean(document)}
    onOpenChange={(open) => !open && onCancel()}
    title="Delete document?"
    description={document ? `This will remove “${document.name}” from the frontend mock library.` : undefined}
    size="sm"
    footer={(
      <>
        <Button variant="secondary" size="md" onClick={onCancel}>Cancel</Button>
        <Button variant="danger" size="md" icon={<Trash2 size={15} />} onClick={onConfirm}>Delete</Button>
      </>
    )}
  >
    <div className="flex items-start gap-3 rounded-2xl border border-[rgba(239,68,68,0.16)] bg-red-50 p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-red-500 shadow-[var(--ds-shadow-xs)]">
        <AlertTriangle size={19} aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-black text-[var(--ds-color-text)]">Confirmation required</p>
        <p className="mt-1 text-sm leading-relaxed text-[var(--ds-color-muted)]">You can continue safely after confirming this destructive action.</p>
      </div>
    </div>
  </Dialog>
);

export default memo(DeleteDocumentDialog);
