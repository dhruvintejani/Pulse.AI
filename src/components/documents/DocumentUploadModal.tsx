import { memo, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, Tag, Upload, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface DocumentUploadModalProps {
  open: boolean;
  categories: string[];
  onClose: () => void;
  onUpload: (files: File[], category: string, tags: string[]) => void;
}

const DocumentUploadModal = ({ open, categories, onClose, onUpload }: DocumentUploadModalProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [category, setCategory] = useState(categories[0] ?? 'Research');
  const [tags, setTags] = useState('AI, Research');
  const [dragging, setDragging] = useState(false);

  const addFiles = (selectedFiles: File[]) => {
    setFiles((current) => [...current, ...selectedFiles].slice(0, 8));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(event.target.files ?? []));
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    addFiles(Array.from(event.dataTransfer.files));
  };

  const handleSubmit = () => {
    if (!files.length) return;
    onUpload(files, category, tags.split(',').map((tag) => tag.trim()).filter(Boolean));
    setFiles([]);
    setTags('AI, Research');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Upload documents"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            className="w-full max-w-xl rounded-3xl bg-[#FFFDF8] border border-[rgba(0,0,0,0.06)] shadow-float overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-[rgba(0,0,0,0.05)]">
              <div>
                <h2 className="text-base font-black text-[#1F1F1F]">Upload documents</h2>
                <p className="text-xs text-[#999] mt-0.5">Frontend-only upload preview using mock data.</p>
              </div>
              <button type="button" onClick={onClose} aria-label="Close upload modal" className="p-2 rounded-xl text-[#999] hover:text-[#666] hover:bg-[rgba(0,0,0,0.04)] focus-ring">
                <X size={17} aria-hidden="true" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <label
                onDragEnter={() => setDragging(true)}
                onDragLeave={() => setDragging(false)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleDrop}
                className={cn(
                  'block rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all',
                  dragging ? 'border-[#E9A24C] bg-[rgba(233,162,76,0.06)]' : 'border-[rgba(0,0,0,0.08)] hover:border-[rgba(233,162,76,0.4)] hover:bg-[rgba(233,162,76,0.02)]'
                )}
              >
                <input type="file" multiple className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt,.md,.csv,.xlsx,image/*" />
                <div className="w-12 h-12 rounded-2xl bg-[rgba(233,162,76,0.1)] flex items-center justify-center mx-auto mb-3">
                  <Upload size={21} className="text-[#E9A24C]" aria-hidden="true" />
                </div>
                <p className="text-sm font-bold text-[#1F1F1F]">Drop files here or browse</p>
                <p className="text-xs text-[#999] mt-1">PDF, DOCX, XLSX, MD, CSV, images up to 50MB</p>
              </label>

              {files.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
                  {files.map((file) => (
                    <div key={`${file.name}-${file.size}-${file.lastModified}`} className="flex items-center gap-3 rounded-xl border border-[rgba(0,0,0,0.05)] bg-[rgba(0,0,0,0.02)] p-3">
                      <FileText size={16} className="text-[#E9A24C]" aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-[#1F1F1F] truncate">{file.name}</p>
                        <p className="text-[11px] text-[#999]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button type="button" onClick={() => setFiles((current) => current.filter((item) => item !== file))} className="p-1 rounded-lg text-[#999] hover:text-red-400 focus-ring" aria-label={`Remove ${file.name}`}>
                        <X size={14} aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-3">
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-[#666]">Category</span>
                  <select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.03)] px-3 py-2.5 text-sm text-[#1F1F1F] outline-none focus:border-[rgba(233,162,76,0.4)]">
                    {categories.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-[#666] flex items-center gap-1"><Tag size={12} aria-hidden="true" /> Tags</span>
                  <input value={tags} onChange={(event) => setTags(event.target.value)} className="w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.03)] px-3 py-2.5 text-sm text-[#1F1F1F] outline-none focus:border-[rgba(233,162,76,0.4)]" placeholder="Research, Strategy" />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 p-5 border-t border-[rgba(0,0,0,0.05)]">
              <Button variant="secondary" size="md" onClick={onClose}>Cancel</Button>
              <Button variant="primary" size="md" icon={<Upload size={15} />} onClick={handleSubmit} disabled={!files.length}>Add documents</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(DocumentUploadModal);
