import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Eye, MoreHorizontal, Star, Trash2 } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import type { MockDocument } from '@/constants/mockData';

interface DocumentCardProps {
  document: MockDocument;
  icon: typeof Eye;
  iconClassName: string;
  iconContainerClassName: string;
  hovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onPreview: () => void;
  onToggleStar: () => void;
  onDelete: () => void;
}

const DocumentCard = ({
  document,
  icon: Icon,
  iconClassName,
  iconContainerClassName,
  hovered,
  onHoverStart,
  onHoverEnd,
  onPreview,
  onToggleStar,
  onDelete,
}: DocumentCardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -4 }}
    onHoverStart={onHoverStart}
    onHoverEnd={onHoverEnd}
    className="bg-[#FFFDF8] rounded-2xl p-4 border border-[rgba(0,0,0,0.05)] shadow-card cursor-pointer group relative overflow-hidden"
  >
    <div className="flex items-start justify-between mb-3">
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', iconContainerClassName)}>
        <Icon size={18} className={iconClassName} aria-hidden="true" />
      </div>
      <div className="flex items-center gap-1">
        {document.analyzed && <Badge variant="success" size="sm">AI</Badge>}
        {document.starred && <Star size={13} className="text-[#E9A24C] fill-[#E9A24C]" aria-hidden="true" />}
      </div>
    </div>
    <p className="text-sm font-bold text-[#1F1F1F] mb-1 leading-snug line-clamp-2">{document.name}</p>
    <p className="text-xs text-[#999] mb-3">{document.size} · {document.pages} pages</p>
    <div className="flex items-center justify-between gap-2">
      <div className="flex gap-1 flex-wrap min-w-0">
        {document.tags.slice(0, 2).map((tag) => <Badge key={tag} variant="neutral" size="sm">{tag}</Badge>)}
      </div>
      <span className="text-[10px] text-[#BBB] shrink-0">{document.updatedAt}</span>
    </div>
    <AnimatePresence>
      {hovered && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 rounded-2xl bg-white/70 backdrop-blur-sm flex items-center justify-center gap-2">
          <button type="button" aria-label={`Preview ${document.name}`} onClick={onPreview} className="p-2.5 rounded-xl bg-white shadow-card hover:bg-[rgba(233,162,76,0.08)] transition-all focus-ring"><Eye size={15} className="text-[#666]" aria-hidden="true" /></button>
          <button type="button" aria-label={`Analyze ${document.name}`} className="p-2.5 rounded-xl bg-white shadow-card hover:bg-[rgba(233,162,76,0.08)] transition-all focus-ring"><Brain size={15} className="text-[#E9A24C]" aria-hidden="true" /></button>
          <button type="button" aria-label={document.starred ? `Unstar ${document.name}` : `Star ${document.name}`} onClick={onToggleStar} className="p-2.5 rounded-xl bg-white shadow-card hover:bg-[rgba(233,162,76,0.08)] transition-all focus-ring"><Star size={15} className={document.starred ? 'text-[#E9A24C] fill-[#E9A24C]' : 'text-[#666]'} aria-hidden="true" /></button>
          <button type="button" aria-label={`Delete ${document.name}`} onClick={onDelete} className="p-2.5 rounded-xl bg-white shadow-card hover:bg-red-50 transition-all focus-ring"><Trash2 size={15} className="text-[#999]" aria-hidden="true" /></button>
          <button type="button" aria-label="More document actions" className="p-2.5 rounded-xl bg-white shadow-card hover:bg-[rgba(233,162,76,0.08)] transition-all focus-ring"><MoreHorizontal size={15} className="text-[#666]" aria-hidden="true" /></button>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export default memo(DocumentCard);
