import { memo, useCallback, useState } from 'react';
import type { ChangeEvent, DragEvent, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropZoneProps {
  label: string;
  description?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  success?: boolean;
  icon?: ReactNode;
  onFiles: (files: File[]) => void;
  className?: string;
}

const DropZone = ({
  label,
  description,
  accept,
  multiple = true,
  disabled,
  success,
  icon,
  onFiles,
  className,
}: DropZoneProps) => {
  const [dragging, setDragging] = useState(false);

  const emitFiles = useCallback((files: File[]) => {
    if (disabled || !files.length) return;
    onFiles(files);
  }, [disabled, onFiles]);

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    emitFiles(Array.from(event.dataTransfer.files));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    emitFiles(Array.from(event.target.files ?? []));
    event.target.value = '';
  };

  return (
    <motion.label
      whileHover={disabled ? undefined : { y: -2 }}
      onDragEnter={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setDragging(false);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      aria-disabled={disabled || undefined}
      className={cn(
        'group relative block cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 ds-focus-ring',
        dragging ? 'scale-[1.01] border-[#E9A24C] bg-[rgba(233,162,76,0.08)]' : 'border-[var(--ds-color-border)] bg-[var(--ds-color-surface-muted)] hover:border-[rgba(233,162,76,0.42)] hover:bg-[var(--ds-color-accent-soft)]',
        disabled && 'cursor-not-allowed opacity-55',
        className
      )}
    >
      <input type="file" className="sr-only" multiple={multiple} accept={accept} disabled={disabled} onChange={handleFileChange} />
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-24 w-44 -translate-x-1/2 rounded-full bg-[rgba(233,162,76,0.12)] blur-2xl" />
      </div>
      <div className={cn('relative mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl shadow-[var(--ds-shadow-xs)] transition-all', success ? 'bg-[var(--ds-color-success-soft)] text-[var(--ds-color-success)]' : dragging ? 'bg-[rgba(233,162,76,0.18)] text-[var(--ds-color-accent)]' : 'bg-[rgba(0,0,0,0.04)] text-[var(--ds-color-subtle)]')}>
        {success ? <CheckCircle2 size={22} aria-hidden="true" /> : icon ?? <UploadCloud size={22} aria-hidden="true" />}
      </div>
      <p className="relative text-sm font-black text-[var(--ds-color-text)]">{dragging ? 'Drop to upload' : label}</p>
      {description && <p className="relative mt-1 text-xs leading-relaxed text-[var(--ds-color-subtle)]">{description}</p>}
      <span className="relative mt-3 inline-flex text-xs font-bold text-[var(--ds-color-accent)]">Browse files</span>
    </motion.label>
  );
};

export default memo(DropZone);
