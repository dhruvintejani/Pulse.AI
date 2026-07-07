import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Upload, Search, Filter, Grid, List,
  Star, MoreHorizontal, FileSpreadsheet, File,
  Plus, Folder, Clock, Eye, Trash2, Download,
  ChevronDown, Brain, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface Doc {
  id: string;
  name: string;
  type: 'pdf' | 'xlsx' | 'doc' | 'md';
  size: string;
  pages?: number;
  updatedAt: string;
  starred: boolean;
  tags: string[];
  analyzed: boolean;
}

const documents: Doc[] = [
  { id: '1', name: 'Q3 Market Research Report', type: 'pdf', size: '4.2 MB', pages: 87, updatedAt: '2 hours ago', starred: true, tags: ['Research', 'Q3'], analyzed: true },
  { id: '2', name: 'Financial Analysis 2025', type: 'xlsx', size: '1.8 MB', pages: 24, updatedAt: '5 hours ago', starred: false, tags: ['Finance'], analyzed: true },
  { id: '3', name: 'Product Roadmap v3', type: 'doc', size: '892 KB', pages: 18, updatedAt: '1 day ago', starred: true, tags: ['Product', 'Strategy'], analyzed: false },
  { id: '4', name: 'Technical Architecture', type: 'md', size: '245 KB', pages: 12, updatedAt: '2 days ago', starred: false, tags: ['Engineering'], analyzed: true },
  { id: '5', name: 'Brand Guidelines 2025', type: 'pdf', size: '12.4 MB', pages: 120, updatedAt: '3 days ago', starred: false, tags: ['Design', 'Brand'], analyzed: false },
  { id: '6', name: 'Sales Playbook', type: 'doc', size: '3.1 MB', pages: 45, updatedAt: '1 week ago', starred: true, tags: ['Sales'], analyzed: true },
];

const folders = [
  { name: 'Research', count: 12, color: 'bg-amber-100 text-amber-600' },
  { name: 'Engineering', count: 8, color: 'bg-blue-100 text-blue-600' },
  { name: 'Marketing', count: 15, color: 'bg-purple-100 text-purple-600' },
  { name: 'Finance', count: 6, color: 'bg-green-100 text-green-600' },
];

const typeIcons = {
  pdf: { icon: FileText, color: 'text-red-500', bg: 'bg-red-50' },
  xlsx: { icon: FileSpreadsheet, color: 'text-green-500', bg: 'bg-green-50' },
  doc: { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
  md: { icon: File, color: 'text-purple-500', bg: 'bg-purple-50' },
};

const DocumentsPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [search, setSearch] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredDoc, setHoveredDoc] = useState<string | null>(null);

  const filtered = documents.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="max-w-5xl mx-auto p-6 pb-32 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between"
        >
          <div>
            <h1 className="text-2xl font-black text-[#1F1F1F] tracking-tight mb-1">Documents</h1>
            <p className="text-sm text-[#999]">{documents.length} files · 23.6 MB used</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md" icon={<Filter size={15} />}>Filter</Button>
            <Button variant="primary" size="md" icon={<Upload size={15} />}>Upload</Button>
          </div>
        </motion.div>

        {/* Upload Drop Zone */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDrop={() => setIsDragging(false)}
          onDragOver={(e) => e.preventDefault()}
          className={cn(
            'rounded-2xl border-2 border-dashed transition-all duration-300 p-8 text-center cursor-pointer',
            isDragging
              ? 'border-[#E9A24C] bg-[rgba(233,162,76,0.06)] scale-[1.01]'
              : 'border-[rgba(0,0,0,0.08)] hover:border-[rgba(233,162,76,0.4)] hover:bg-[rgba(233,162,76,0.02)]'
          )}
        >
          <div className="flex flex-col items-center gap-3">
            <div className={cn(
              'w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300',
              isDragging ? 'bg-[rgba(233,162,76,0.15)]' : 'bg-[rgba(0,0,0,0.04)]'
            )}>
              <Upload size={20} className={isDragging ? 'text-[#E9A24C]' : 'text-[#CCC]'} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1F1F1F]">
                {isDragging ? 'Drop to upload' : 'Drop files here or click to upload'}
              </p>
              <p className="text-xs text-[#999] mt-0.5">PDF, DOCX, XLSX, MD up to 50MB each</p>
            </div>
            {!isDragging && (
              <button className="text-xs font-semibold text-[#E9A24C] hover:underline">Browse files</button>
            )}
          </div>
        </motion.div>

        {/* Folders */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-bold text-[#1F1F1F] mb-3">Folders</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {folders.map((folder, i) => (
              <motion.button
                key={i}
                whileHover={{ y: -3, scale: 1.02 }}
                className="bg-[#FFFDF8] rounded-2xl p-4 border border-[rgba(0,0,0,0.05)] shadow-card text-left flex items-center gap-3"
              >
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', folder.color.split(' ')[0])}>
                  <Folder size={17} className={folder.color.split(' ')[1]} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1F1F1F]">{folder.name}</p>
                  <p className="text-xs text-[#999]">{folder.count} files</p>
                </div>
              </motion.button>
            ))}
            <motion.button
              whileHover={{ y: -3 }}
              className="bg-transparent rounded-2xl p-4 border-2 border-dashed border-[rgba(0,0,0,0.08)] flex items-center gap-3 hover:border-[rgba(233,162,76,0.4)] transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-[rgba(0,0,0,0.03)] flex items-center justify-center">
                <Plus size={16} className="text-[#CCC]" />
              </div>
              <span className="text-sm text-[#CCC] font-medium">New folder</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Documents List */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#CCC]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search documents..."
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-[#FFFDF8] border border-[rgba(0,0,0,0.08)] text-[#1F1F1F] placeholder:text-[#CCC] outline-none focus:border-[rgba(233,162,76,0.4)] shadow-card"
              />
            </div>
            <div className="flex items-center gap-1 bg-[#FFFDF8] rounded-xl border border-[rgba(0,0,0,0.06)] p-1 shadow-card">
              <button
                onClick={() => setViewMode('list')}
                className={cn('p-1.5 rounded-lg transition-all', viewMode === 'list' ? 'bg-[rgba(233,162,76,0.1)] text-[#E9A24C]' : 'text-[#CCC] hover:text-[#999]')}
              >
                <List size={15} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={cn('p-1.5 rounded-lg transition-all', viewMode === 'grid' ? 'bg-[rgba(233,162,76,0.1)] text-[#E9A24C]' : 'text-[#CCC] hover:text-[#999]')}
              >
                <Grid size={15} />
              </button>
            </div>
            <button className="flex items-center gap-1.5 text-sm text-[#666] px-3 py-2.5 rounded-xl border border-[rgba(0,0,0,0.06)] bg-[#FFFDF8] shadow-card hover:border-[rgba(233,162,76,0.3)] transition-all">
              <span className="text-xs font-medium">Sort: Recent</span>
              <ChevronDown size={13} />
            </button>
          </div>

          {/* Files */}
          <div className={cn(
            viewMode === 'grid'
              ? 'grid grid-cols-2 md:grid-cols-3 gap-4'
              : 'space-y-2'
          )}>
            {filtered.map((doc, i) => {
              const typeInfo = typeIcons[doc.type];
              const Icon = typeInfo.icon;
              const isHovered = hoveredDoc === doc.id;

              if (viewMode === 'grid') {
                return (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ y: -4 }}
                    onHoverStart={() => setHoveredDoc(doc.id)}
                    onHoverEnd={() => setHoveredDoc(null)}
                    className="bg-[#FFFDF8] rounded-2xl p-4 border border-[rgba(0,0,0,0.05)] shadow-card cursor-pointer group relative"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', typeInfo.bg)}>
                        <Icon size={18} className={typeInfo.color} />
                      </div>
                      <div className="flex items-center gap-1">
                        {doc.analyzed && <Badge variant="success" size="sm">AI ✓</Badge>}
                        {doc.starred && <Star size={13} className="text-[#E9A24C] fill-[#E9A24C]" />}
                      </div>
                    </div>
                    <p className="text-sm font-bold text-[#1F1F1F] mb-1 leading-snug">{doc.name}</p>
                    <p className="text-xs text-[#999] mb-3">{doc.size} · {doc.pages} pages</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1 flex-wrap">
                        {doc.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="neutral" size="sm">{tag}</Badge>
                        ))}
                      </div>
                      <span className="text-[10px] text-[#BBB]">{doc.updatedAt}</span>
                    </div>

                    {/* Hover actions */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 rounded-2xl bg-white/70 backdrop-blur-sm flex items-center justify-center gap-2"
                        >
                          <button className="p-2.5 rounded-xl bg-white shadow-card hover:bg-[rgba(233,162,76,0.08)] transition-all">
                            <Eye size={15} className="text-[#666]" />
                          </button>
                          <button className="p-2.5 rounded-xl bg-white shadow-card hover:bg-[rgba(233,162,76,0.08)] transition-all">
                            <Brain size={15} className="text-[#E9A24C]" />
                          </button>
                          <button className="p-2.5 rounded-xl bg-white shadow-card hover:bg-[rgba(233,162,76,0.08)] transition-all">
                            <Download size={15} className="text-[#666]" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ x: 3 }}
                  className="flex items-center gap-4 p-4 bg-[#FFFDF8] rounded-2xl border border-[rgba(0,0,0,0.05)] shadow-card cursor-pointer group hover:border-[rgba(233,162,76,0.2)] transition-all duration-150"
                >
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', typeInfo.bg)}>
                    <Icon size={18} className={typeInfo.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-bold text-[#1F1F1F] truncate">{doc.name}</p>
                      {doc.starred && <Star size={12} className="text-[#E9A24C] fill-[#E9A24C] shrink-0" />}
                      {doc.analyzed && (
                        <span className="shrink-0 flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                          <Sparkles size={9} /> AI
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#999]">{doc.size}</span>
                      <span className="text-[#DDD]">·</span>
                      <span className="text-xs text-[#999]">{doc.pages} pages</span>
                      <span className="text-[#DDD]">·</span>
                      <div className="flex gap-1">
                        {doc.tags.map(tag => (
                          <Badge key={tag} variant="neutral" size="sm">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-[#BBB] hidden sm:block flex items-center gap-1">
                      <Clock size={11} className="inline mr-1" />{doc.updatedAt}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-lg hover:bg-[rgba(233,162,76,0.08)] transition-colors">
                        <Brain size={14} className="text-[#E9A24C]" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-[rgba(0,0,0,0.04)] transition-colors">
                        <Download size={14} className="text-[#999]" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 size={14} className="text-[#CCC] hover:text-red-400" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-[rgba(0,0,0,0.04)] transition-colors">
                        <MoreHorizontal size={14} className="text-[#CCC]" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DocumentsPage;
