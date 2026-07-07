import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Upload, Search, Filter, Grid, List,
  Star, MoreHorizontal, FileSpreadsheet, File,
  Plus, Folder, Eye, Trash2, Download,
  Brain, Sparkles
} from 'lucide-react';
import DataTable from '@/components/data/DataTable';
import type { DataTableColumn } from '@/components/data/DataTable';
import Skeleton from '@/components/ui/Skeleton';
import { mockDocuments, mockFolders } from '@/constants/mockData';
import { queryKeys } from '@/constants/queryKeys';
import { useMockResource } from '@/hooks/useMockResource';
import { cn } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import type { MockDocument } from '@/constants/mockData';

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
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [starredIds, setStarredIds] = useState<string[]>(mockDocuments.filter((doc) => doc.starred).map((doc) => doc.id));

  const documentsQuery = useMockResource({ queryKey: queryKeys.documents, data: mockDocuments });
  const documents = useMemo(() => (
    (documentsQuery.data ?? [])
      .filter((doc) => !deletedIds.includes(doc.id))
      .map((doc) => ({ ...doc, starred: starredIds.includes(doc.id) }))
  ), [deletedIds, documentsQuery.data, starredIds]);

  const filteredGridDocuments = documents.filter((doc) => (
    doc.name.toLowerCase().includes(search.toLowerCase()) ||
    doc.tags.join(' ').toLowerCase().includes(search.toLowerCase()) ||
    doc.folder.toLowerCase().includes(search.toLowerCase())
  ));

  const toggleStar = (documentId: string) => {
    setStarredIds((current) => (
      current.includes(documentId)
        ? current.filter((id) => id !== documentId)
        : [...current, documentId]
    ));
  };

  const columns: DataTableColumn<MockDocument>[] = [
    {
      id: 'name',
      header: 'Document',
      accessor: (doc) => doc.name,
      sortable: true,
      render: (doc) => {
        const typeInfo = typeIcons[doc.type];
        const Icon = typeInfo.icon;
        return (
          <div className="flex items-center gap-3 min-w-0">
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', typeInfo.bg)}>
              <Icon size={16} className={typeInfo.color} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1F1F1F] truncate">{doc.name}</span>
                {doc.starred && <Star size={12} className="text-[#E9A24C] fill-[#E9A24C] shrink-0" />}
              </div>
              <span className="text-xs text-[#999]">{doc.owner} · {doc.updatedAt}</span>
            </div>
          </div>
        );
      },
    },
    {
      id: 'type',
      header: 'Type',
      accessor: (doc) => doc.type,
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: 'PDF', value: 'pdf' },
        { label: 'Spreadsheet', value: 'xlsx' },
        { label: 'Document', value: 'doc' },
        { label: 'Markdown', value: 'md' },
      ],
      render: (doc) => <Badge variant="neutral" size="sm">{doc.type.toUpperCase()}</Badge>,
    },
    {
      id: 'folder',
      header: 'Folder',
      accessor: (doc) => doc.folder,
      sortable: true,
      filterable: true,
      filterOptions: ['Research', 'Finance', 'Product', 'Engineering', 'Marketing', 'Sales'].map((folder) => ({ label: folder, value: folder })),
      render: (doc) => <span className="text-xs font-medium text-[#666]">{doc.folder}</span>,
    },
    { id: 'size', header: 'Size', accessor: (doc) => doc.sizeMb, sortable: true, render: (doc) => doc.size },
    { id: 'pages', header: 'Pages', accessor: (doc) => doc.pages, sortable: true },
    {
      id: 'analyzed',
      header: 'AI',
      accessor: (doc) => (doc.analyzed ? 'yes' : 'no'),
      filterable: true,
      filterOptions: [{ label: 'Analyzed', value: 'yes' }, { label: 'Not analyzed', value: 'no' }],
      render: (doc) => doc.analyzed ? <Badge variant="success" size="sm">AI</Badge> : <Badge variant="neutral" size="sm">Pending</Badge>,
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (doc) => doc.id,
      filterable: false,
      render: (doc) => (
        <div className="flex items-center gap-1">
          <button onClick={() => toggleStar(doc.id)} className="p-1.5 rounded-lg hover:bg-[rgba(233,162,76,0.08)] transition-colors">
            <Star size={13} className={doc.starred ? 'text-[#E9A24C] fill-[#E9A24C]' : 'text-[#CCC]'} />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-[rgba(0,0,0,0.04)] transition-colors"><Download size={13} className="text-[#999]" /></button>
          <button onClick={() => setDeletedIds((current) => [...current, doc.id])} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"><Trash2 size={13} className="text-[#CCC] hover:text-red-400" /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="max-w-5xl mx-auto p-6 pb-32 space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#1F1F1F] tracking-tight mb-1">Documents</h1>
            <p className="text-sm text-[#999]">{documents.length} files · {documents.reduce((sum, doc) => sum + doc.sizeMb, 0).toFixed(1)} MB used</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md" icon={<Filter size={15} />}>Filter</Button>
            <Button variant="primary" size="md" icon={<Upload size={15} />}>Upload</Button>
          </div>
        </motion.div>

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
            isDragging ? 'border-[#E9A24C] bg-[rgba(233,162,76,0.06)] scale-[1.01]' : 'border-[rgba(0,0,0,0.08)] hover:border-[rgba(233,162,76,0.4)] hover:bg-[rgba(233,162,76,0.02)]'
          )}
        >
          <div className="flex flex-col items-center gap-3">
            <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300', isDragging ? 'bg-[rgba(233,162,76,0.15)]' : 'bg-[rgba(0,0,0,0.04)]')}>
              <Upload size={20} className={isDragging ? 'text-[#E9A24C]' : 'text-[#CCC]'} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1F1F1F]">{isDragging ? 'Drop to upload' : 'Drop files here or click to upload'}</p>
              <p className="text-xs text-[#999] mt-0.5">PDF, DOCX, XLSX, MD up to 50MB each</p>
            </div>
            {!isDragging && <button className="text-xs font-semibold text-[#E9A24C] hover:underline">Browse files</button>}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-sm font-bold text-[#1F1F1F] mb-3">Folders</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {mockFolders.map((folder) => (
              <motion.button key={folder.name} whileHover={{ y: -3, scale: 1.02 }} onClick={() => { setSearch(folder.name); setViewMode('grid'); }} className="bg-[#FFFDF8] rounded-2xl p-4 border border-[rgba(0,0,0,0.05)] shadow-card text-left flex items-center gap-3">
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', folder.color.split(' ')[0])}>
                  <Folder size={17} className={folder.color.split(' ')[1]} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1F1F1F]">{folder.name}</p>
                  <p className="text-xs text-[#999]">{folder.count} files</p>
                </div>
              </motion.button>
            ))}
            <motion.button whileHover={{ y: -3 }} className="bg-transparent rounded-2xl p-4 border-2 border-dashed border-[rgba(0,0,0,0.08)] flex items-center gap-3 hover:border-[rgba(233,162,76,0.4)] transition-all">
              <div className="w-9 h-9 rounded-xl bg-[rgba(0,0,0,0.03)] flex items-center justify-center"><Plus size={16} className="text-[#CCC]" /></div>
              <span className="text-sm text-[#CCC] font-medium">New folder</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="flex items-center gap-3 mb-4">
            {viewMode === 'grid' && (
              <div className="relative flex-1 max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#CCC]" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search documents..." className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-[#FFFDF8] border border-[rgba(0,0,0,0.08)] text-[#1F1F1F] placeholder:text-[#CCC] outline-none focus:border-[rgba(233,162,76,0.4)] shadow-card" />
              </div>
            )}
            <div className="flex items-center gap-1 bg-[#FFFDF8] rounded-xl border border-[rgba(0,0,0,0.06)] p-1 shadow-card">
              <button onClick={() => setViewMode('list')} className={cn('p-1.5 rounded-lg transition-all', viewMode === 'list' ? 'bg-[rgba(233,162,76,0.1)] text-[#E9A24C]' : 'text-[#CCC] hover:text-[#999]')}><List size={15} /></button>
              <button onClick={() => setViewMode('grid')} className={cn('p-1.5 rounded-lg transition-all', viewMode === 'grid' ? 'bg-[rgba(233,162,76,0.1)] text-[#E9A24C]' : 'text-[#CCC] hover:text-[#999]')}><Grid size={15} /></button>
            </div>
          </div>

          {viewMode === 'list' ? (
            <DataTable
              data={documents}
              columns={columns}
              getRowId={(doc) => doc.id}
              loading={documentsQuery.isLoading}
              searchPlaceholder="Search documents..."
              emptyTitle="No documents found"
              emptyDescription="Upload a document or clear your filters."
              pageSize={5}
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {documentsQuery.isLoading && Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-44 rounded-2xl" />)}
              {!documentsQuery.isLoading && filteredGridDocuments.map((doc, i) => {
                const typeInfo = typeIcons[doc.type];
                const Icon = typeInfo.icon;
                const isHovered = hoveredDoc === doc.id;
                return (
                  <motion.div key={doc.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }} whileHover={{ y: -4 }} onHoverStart={() => setHoveredDoc(doc.id)} onHoverEnd={() => setHoveredDoc(null)} className="bg-[#FFFDF8] rounded-2xl p-4 border border-[rgba(0,0,0,0.05)] shadow-card cursor-pointer group relative">
                    <div className="flex items-start justify-between mb-3">
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', typeInfo.bg)}><Icon size={18} className={typeInfo.color} /></div>
                      <div className="flex items-center gap-1">{doc.analyzed && <Badge variant="success" size="sm">AI</Badge>}{doc.starred && <Star size={13} className="text-[#E9A24C] fill-[#E9A24C]" />}</div>
                    </div>
                    <p className="text-sm font-bold text-[#1F1F1F] mb-1 leading-snug">{doc.name}</p>
                    <p className="text-xs text-[#999] mb-3">{doc.size} · {doc.pages} pages</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1 flex-wrap">{doc.tags.slice(0, 2).map((tag) => <Badge key={tag} variant="neutral" size="sm">{tag}</Badge>)}</div>
                      <span className="text-[10px] text-[#BBB]">{doc.updatedAt}</span>
                    </div>
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 rounded-2xl bg-white/70 backdrop-blur-sm flex items-center justify-center gap-2">
                          <button className="p-2.5 rounded-xl bg-white shadow-card hover:bg-[rgba(233,162,76,0.08)] transition-all"><Eye size={15} className="text-[#666]" /></button>
                          <button className="p-2.5 rounded-xl bg-white shadow-card hover:bg-[rgba(233,162,76,0.08)] transition-all"><Brain size={15} className="text-[#E9A24C]" /></button>
                          <button onClick={() => toggleStar(doc.id)} className="p-2.5 rounded-xl bg-white shadow-card hover:bg-[rgba(233,162,76,0.08)] transition-all"><Star size={15} className={doc.starred ? 'text-[#E9A24C] fill-[#E9A24C]' : 'text-[#666]'} /></button>
                          <button onClick={() => setDeletedIds((current) => [...current, doc.id])} className="p-2.5 rounded-xl bg-white shadow-card hover:bg-red-50 transition-all"><Trash2 size={15} className="text-[#999]" /></button>
                          <button className="p-2.5 rounded-xl bg-white shadow-card hover:bg-[rgba(233,162,76,0.08)] transition-all"><MoreHorizontal size={15} className="text-[#666]" /></button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
              {!documentsQuery.isLoading && filteredGridDocuments.length === 0 && (
                <div className="col-span-full text-center py-12 bg-[#FFFDF8] rounded-2xl border border-[rgba(0,0,0,0.05)] shadow-card">
                  <Sparkles size={22} className="text-[#E9A24C] mx-auto mb-3" />
                  <p className="text-sm font-bold text-[#1F1F1F]">No documents found</p>
                  <p className="text-xs text-[#999] mt-1">Try a different search or upload a new file.</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DocumentsPage;
