import { memo } from 'react';
import { FileText, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatAttachment } from '@/types/chat';

interface ChatAttachmentPreviewProps {
  attachments: ChatAttachment[];
  removable?: boolean;
  onRemove?: (attachmentId: string) => void;
  compact?: boolean;
  className?: string;
}

const ChatAttachmentPreview = ({ attachments, removable = false, onRemove, compact = false, className }: ChatAttachmentPreviewProps) => {
  if (!attachments.length) return null;

  return (
    <div className={cn('grid gap-2', compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2', className)}>
      {attachments.map((attachment) => {
        const isImage = attachment.type === 'image' && attachment.previewUrl;

        return (
          <div
            key={attachment.id}
            className="group relative overflow-hidden rounded-xl border border-[rgba(0,0,0,0.06)] bg-white/60 shadow-sm"
          >
            {isImage ? (
              <div className="flex items-center gap-3 p-2">
                <img
                  src={attachment.previewUrl}
                  alt={attachment.name}
                  className="h-16 w-16 rounded-lg object-cover border border-[rgba(0,0,0,0.05)]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-[#E9A24C]">
                    <ImageIcon size={13} aria-hidden="true" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider">Image</span>
                  </div>
                  <p className="truncate text-xs font-semibold text-[#1F1F1F] mt-1">{attachment.name}</p>
                  <p className="text-[11px] text-[#999]">{attachment.size}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3">
                <div className="h-10 w-10 rounded-xl bg-[rgba(233,162,76,0.1)] flex items-center justify-center shrink-0">
                  <FileText size={17} className="text-[#E9A24C]" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-[#1F1F1F]">{attachment.name}</p>
                  <p className="text-[11px] text-[#999]">{attachment.size} · {attachment.mimeType || 'file'}</p>
                </div>
              </div>
            )}

            {removable && onRemove && (
              <button
                type="button"
                onClick={() => onRemove(attachment.id)}
                aria-label={`Remove ${attachment.name}`}
                className="absolute right-2 top-2 rounded-lg bg-[#1F1F1F]/80 p-1 text-white opacity-0 transition-opacity hover:bg-[#1F1F1F] focus-ring group-hover:opacity-100 group-focus-within:opacity-100"
              >
                <X size={12} aria-hidden="true" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default memo(ChatAttachmentPreview);
