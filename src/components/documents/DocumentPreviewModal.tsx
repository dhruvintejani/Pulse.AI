import { memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Brain, Download, FileText, X } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import type { MockDocument } from '@/constants/mockData';

interface DocumentPreviewModalProps {
  document: MockDocument | null;
  onClose: () => void;
}

const DocumentPreviewModal = ({ document, onClose }: DocumentPreviewModalProps) => (
  <AnimatePresence>
    {document && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Document preview"
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          className="w-full max-w-2xl rounded-3xl bg-[#FFFDF8] border border-[rgba(0,0,0,0.06)] shadow-float overflow-hidden"
        >
          <div className="flex items-center justify-between p-5 border-b border-[rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-[rgba(233,162,76,0.1)] flex items-center justify-center shrink-0">
                <FileText size={19} className="text-[#E9A24C]" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-black text-[#1F1F1F] truncate">{document.name}</h2>
                <p className="text-xs text-[#999]">{document.owner} · {document.updatedAt}</p>
              </div>
            </div>
            <button type="button" onClick={onClose} aria-label="Close preview" className="p-2 rounded-xl text-[#999] hover:text-[#666] hover:bg-[rgba(0,0,0,0.04)] transition-colors focus-ring">
              <X size={17} aria-hidden="true" />
            </button>
          </div>

          <div className="p-5 grid md:grid-cols-[1.2fr_0.8fr] gap-5">
            <div className="rounded-2xl border border-[rgba(0,0,0,0.05)] bg-[rgba(0,0,0,0.02)] min-h-72 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Brain size={16} className="text-[#E9A24C]" aria-hidden="true" />
                  <p className="text-sm font-bold text-[#1F1F1F]">AI Preview</p>
                </div>
                <p className="text-sm text-[#666] leading-relaxed">
                  Pulse AI found {document.pages} pages of content in this document. Key themes include {document.tags.join(', ')} and the file is stored in the {document.folder} category.
                </p>
                <div className="mt-5 space-y-2">
                  {['Executive summary detected', 'Action items extracted', 'Search index ready'].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-[#666]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E9A24C]" aria-hidden="true" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-[#BBB] mt-6">This is a frontend-only mock preview. Backend parsing can replace this content later.</p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#BBB] font-semibold mb-2">Details</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-[#999]">Type</span><span className="font-semibold text-[#1F1F1F] uppercase">{document.type}</span></div>
                  <div className="flex justify-between"><span className="text-[#999]">Size</span><span className="font-semibold text-[#1F1F1F]">{document.size}</span></div>
                  <div className="flex justify-between"><span className="text-[#999]">Pages</span><span className="font-semibold text-[#1F1F1F]">{document.pages}</span></div>
                  <div className="flex justify-between"><span className="text-[#999]">Folder</span><span className="font-semibold text-[#1F1F1F]">{document.folder}</span></div>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#BBB] font-semibold mb-2">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {document.tags.map((tag) => <Badge key={tag} variant="neutral" size="sm">{tag}</Badge>)}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="primary" size="md" icon={<Brain size={15} />}>Analyze</Button>
                <Button variant="secondary" size="md" icon={<Download size={15} />}>Download</Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default memo(DocumentPreviewModal);
