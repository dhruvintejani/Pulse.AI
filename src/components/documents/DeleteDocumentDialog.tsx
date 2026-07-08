import { memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { MockDocument } from '@/constants/mockData';

interface DeleteDocumentDialogProps {
  document: MockDocument | null;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteDocumentDialog = ({ document, onCancel, onConfirm }: DeleteDocumentDialogProps) => (
  <AnimatePresence>
    {document && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Delete document confirmation"
      >
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.96 }}
          className="w-full max-w-md rounded-3xl bg-[#FFFDF8] border border-[rgba(0,0,0,0.06)] shadow-float p-6"
        >
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                <AlertTriangle size={19} className="text-red-500" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-black text-[#1F1F1F]">Delete document?</h2>
                <p className="text-sm text-[#666] mt-1 leading-relaxed">
                  This will remove <span className="font-semibold text-[#1F1F1F]">{document.name}</span> from the frontend mock library.
                </p>
              </div>
            </div>
            <button type="button" onClick={onCancel} aria-label="Cancel delete" className="p-1.5 rounded-xl text-[#999] hover:text-[#666] hover:bg-[rgba(0,0,0,0.04)] focus-ring">
              <X size={16} aria-hidden="true" />
            </button>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" size="md" onClick={onCancel}>Cancel</Button>
            <Button variant="primary" size="md" icon={<Trash2 size={15} />} onClick={onConfirm}>Delete</Button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default memo(DeleteDocumentDialog);
