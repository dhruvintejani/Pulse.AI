import { memo, useState } from 'react';
import { FileText, GripVertical, Tag, Upload, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Dialog from '@/components/ui/Dialog';
import DropZone from '@/components/ui/DropZone';
import Progress from '@/components/ui/Progress';
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
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const addFiles = (selectedFiles: File[]) => {
    setFiles((current) => [...current, ...selectedFiles].slice(0, 8));
    setUploadProgress(0);
  };

  const moveFile = (from: number, to: number) => {
    setFiles((current) => {
      const next = [...current];
      const [item] = next.splice(from, 1);
      if (!item) return current;
      next.splice(to, 0, item);
      return next;
    });
  };

  const reset = () => {
    setFiles([]);
    setTags('AI, Research');
    setUploadProgress(0);
    setUploading(false);
    setDragIndex(null);
  };

  const handleSubmit = () => {
    if (!files.length || uploading) return;
    setUploading(true);
    setUploadProgress(12);

    const timer = window.setInterval(() => {
      setUploadProgress((current) => Math.min(94, current + 14));
    }, 90);

    window.setTimeout(() => {
      window.clearInterval(timer);
      setUploadProgress(100);
      onUpload(files, category, tags.split(',').map((tag) => tag.trim()).filter(Boolean));
      window.setTimeout(() => {
        reset();
        onClose();
      }, 260);
    }, 760);
  };

  const close = () => {
    if (uploading) return;
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && close()}
      title="Upload documents"
      description="Drop, reorder, tag, and add documents with a smooth optimistic upload preview."
      size="lg"
      preventOutsideClose={uploading}
      footer={(
        <>
          <Button variant="secondary" size="md" onClick={close} disabled={uploading}>Cancel</Button>
          <Button variant="primary" size="md" icon={<Upload size={15} />} onClick={handleSubmit} disabled={!files.length} loading={uploading}>Add documents</Button>
        </>
      )}
    >
      <div className="space-y-4">
        <DropZone
          label={files.length ? 'Add more files or drop to reorder below' : 'Drop files here or browse'}
          description="PDF, DOCX, XLSX, MD, CSV, TXT, and images up to 50MB"
          accept=".pdf,.doc,.docx,.txt,.md,.csv,.xlsx,image/*"
          disabled={uploading}
          success={uploadProgress === 100}
          onFiles={addFiles}
        />

        {files.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--ds-color-subtle)]">Upload queue</p>
              <span className="text-xs font-semibold text-[var(--ds-color-subtle)]">Drag files to reorder</span>
            </div>
            <div className="max-h-48 space-y-2 overflow-y-auto pr-1 ds-scrollbar" aria-label="Selected files">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${file.size}-${file.lastModified}`}
                  draggable={!uploading}
                  onDragStart={() => setDragIndex(index)}
                  onDragEnter={() => dragIndex !== null && dragIndex !== index && moveFile(dragIndex, index)}
                  onDragEnd={() => setDragIndex(null)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border border-[var(--ds-color-border)] bg-[var(--ds-color-surface-muted)] p-3 transition-all',
                    dragIndex === index && 'scale-[0.99] opacity-60'
                  )}
                >
                  <GripVertical size={15} className="shrink-0 cursor-grab text-[var(--ds-color-subtle)]" aria-hidden="true" />
                  <FileText size={16} className="shrink-0 text-[#E9A24C]" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-[var(--ds-color-text)]">{file.name}</p>
                    <p className="text-[11px] text-[var(--ds-color-subtle)]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button type="button" onClick={() => setFiles((current) => current.filter((item) => item !== file))} disabled={uploading} className="rounded-lg p-1 text-[var(--ds-color-subtle)] hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50 ds-focus-ring" aria-label={`Remove ${file.name}`}>
                    <X size={14} aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {uploading && <Progress value={uploadProgress} label="Uploading documents" showValue />}

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-[var(--ds-color-muted)]">Category</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)} disabled={uploading} className="ds-control w-full px-3 py-2.5 text-sm">
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="flex items-center gap-1 text-xs font-semibold text-[var(--ds-color-muted)]"><Tag size={12} aria-hidden="true" /> Tags</span>
            <input value={tags} onChange={(event) => setTags(event.target.value)} disabled={uploading} className="ds-control w-full px-3 py-2.5 text-sm" placeholder="Research, Strategy" />
          </label>
        </div>
      </div>
    </Dialog>
  );
};

export default memo(DocumentUploadModal);
