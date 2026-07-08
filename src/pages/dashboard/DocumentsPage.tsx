import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Upload, Search, Filter, Grid, List,
  Star, FileSpreadsheet, File, Plus, Folder,
  Download, Sparkles, Tags, ArrowUpDown
} from 'lucide-react';
import DataTable from '@/components/data/DataTable';
import type { DataTableColumn } from '@/components/data/DataTable';
import Skeleton from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import {
  DeleteDocumentDialog,
  DocumentCard,
  DocumentPreviewModal,
  DocumentUploadModal,
} from '@/components/documents';
import { mockDocuments, mockFolders } from '@/constants/mockData';
import type { DocumentType, MockDocument } from '@/constants/mockData';
import { queryKeys } from '@/constants/queryKeys';
import { useMockResource } from '@/hooks/useMockResource';
import { cn } from '@/lib/utils';

const typeIcons = {
  pdf: { icon: FileText, color: 'text-red-500', bg: 'bg-red-50' },
  xlsx: { icon: FileSpreadsheet, color: 'text-green-500', bg: 'bg-green-50' },
  doc: { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
  md: { icon: File, color: 'text-purple-500', bg: 'bg-purple-50' },
} satisfies Record<DocumentType, { icon: typeof FileText; color: string; bg: string }>;

const sortOptions = [
  { label: 'Newest', value: 'recent' },
  { label: 'Name', value: 'name' },
  { label: 'Size', value: 'size' },
  { label: 'Pages', value: 'pages' },
  { label: 'Starred', value: 'starred' },
] as const;

type DocumentSort = (typeof sortOptions)[number]['value'];

const fileTypeFromName = (name: string): DocumentType => {
  const extension = name.split('.').pop()?.toLowerCase();
  if (extension === 'pdf') return 'pdf';
  if (extension === 'xlsx' || extension === 'csv') return 'xlsx';
  if (extension === 'md' || extension === 'txt') return 'md';
  return 'doc';
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const DocumentsPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [tagFilter, setTagFilter] = useState('All');
  const [sortBy, setSortBy] = useState<DocumentSort>('recent');
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredDoc, setHoveredDoc] = useState<string | null>(null);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [starredIds, setStarredIds] = useState<string[]>(mockDocuments.filter((doc) => doc.starred).map((doc) => doc.id));
  const [uploadedDocuments, setUploadedDocuments] = useState<MockDocument[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<MockDocument | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MockDocument | null>(null);

  const documentsQuery = useMockResource({ queryKey: queryKeys.documents, data: mockDocuments });

  const categories = useMemo(() => (
    Array.from(new Set([...mockFolders.map((folder) => folder.name), ...uploadedDocuments.map((doc) => doc.folder)]))
  ), [uploadedDocuments]);

  const allDocuments = useMemo(() => ([...(documentsQuery.data ?? []), ...uploadedDocuments]), [documentsQuery.data, uploadedDocuments]);

  const documents = useMemo(() => (
    allDocuments
      .filter((doc) => !deletedIds.includes(doc.id))
      .map((doc) => ({ ...doc, starred: starredIds.includes(doc.id) }))
  ), [allDocuments, deletedIds, starredIds]);

  const availableTags = useMemo(() => Array.from(new Set(documents.flatMap((doc) => doc.tags))).sort(), [documents]);
  const recentDocuments = useMemo(() => documents.slice(0, 4), [documents]);

  const filteredDocuments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = documents.filter((doc) => {
      const matchesSearch = !normalizedSearch ||
        doc.name.toLowerCase().includes(normalizedSearch) ||
        doc.tags.join(' ').toLowerCase().includes(normalizedSearch) ||
        doc.folder.toLowerCase().includes(normalizedSearch) ||
        doc.owner.toLowerCase().includes(normalizedSearch);
      const matchesCategory = categoryFilter === 'All' || doc.folder === categoryFilter;
      const matchesType = typeFilter === 'All' || doc.type === typeFilter;
      const matchesTag = tagFilter === 'All' || doc.tags.includes(tagFilter);

      return matchesSearch && matchesCategory && matchesType && matchesTag;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'size') return b.sizeMb - a.sizeMb;
      if (sortBy === 'pages') return b.pages - a.pages;
      if (sortBy === 'starred') return Number(b.starred) - Number(a.starred);
      return a.updatedAt.localeCompare(b.updatedAt);
    });
  }, [categoryFilter, documents, search, sortBy, tagFilter, typeFilter]);

  const toggleStar = (documentId: string) => {
    setStarredIds((current) => (
      current.includes(documentId)
        ? current.filter((id) => id !== documentId)
        : [...current, documentId]
    ));
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setDeletedIds((current) => [...current, deleteTarget.id]);
    setDeleteTarget(null);
  };

  const handleUpload = (files: File[], category: string, tags: string[]) => {
    const docs = files.map((file, index): MockDocument => {
      const type = fileTypeFromName(file.name);
      const sizeMb = Number((file.size / (1024 * 1024)).toFixed(2));

      return {
        id: `uploaded-${Date.now()}-${index}`,
        name: file.name.replace(/\.[^/.]+$/, '') || file.name,
        type,
        size: formatFileSize(file.size),
        sizeMb,
        pages: Math.max(1, Math.round(sizeMb * 12) || 1),
        updatedAt: 'just now',
        starred: false,
        tags: tags.length ? tags : ['Uploaded'],
        analyzed: false,
        owner: 'Alex',
        folder: category,
      };
    });

    setUploadedDocuments((current) => [...docs, ...current]);
    setViewMode('grid');
  };

  const columns = useMemo<DataTableColumn<MockDocument>[]>(() => [
    {
      id: 'name',
      header: 'Document',
      accessor: (doc) => doc.name,
      sortable: true,
      render: (doc) => {
        const typeInfo = typeIcons[doc.type];
        const Icon = typeInfo.icon;
        return (
          <button type="button" onClick={() => setPreviewDocument(doc)} className="flex items-center gap-3 min-w-0 text-left focus-ring rounded-xl">
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', typeInfo.bg)}>
              <Icon size={16} className={typeInfo.color} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1F1F1F] truncate">{doc.name}</span>
                {doc.starred && <Star size={12} className="text-[#E9A24C] fill-[#E9A24C] shrink-0" aria-hidden="true" />}
              </div>
              <span className="text-xs text-[#999]">{doc.owner} · {doc.updatedAt}</span>
            </div>
          </button>
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
      header: 'Category',
      accessor: (doc) => doc.folder,
      sortable: true,
      filterable: true,
      filterOptions: categories.map((folder) => ({ label: folder, value: folder })),
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
          <button type="button" aria-label={doc.starred ? `Unstar ${doc.name}` : `Star ${doc.name}`} onClick={() => toggleStar(doc.id)} className="p-1.5 rounded-lg hover:bg-[rgba(233,162,76,0.08)] transition-colors focus-ring">
            <Star size={13} className={doc.starred ? 'text-[#E9A24C] fill-[#E9A24C]' : 'text-[#CCC]'} aria-hidden="true" />
          </button>
          <button type="button" aria-label={`Download ${doc.name}`} className="p-1.5 rounded-lg hover:bg-[rgba(0,0,0,0.04)] transition-colors focus-ring"><Download size={13} className="text-[#999]" aria-hidden="true" /></button>
          <button type="button" aria-label={`Delete ${doc.name}`} onClick={() => setDeleteTarget(doc)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors focus-ring"><FileText className="sr-only" /><span className="sr-only">Delete</span><Star className="hidden" /><span aria-hidden="true" className="inline-flex"><Download className="hidden" /><File className="hidden" /></span><span className="inline-flex"><TrashIcon /></span></button>
        </div>
      ),
    },
  ], [categories]);

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 pb-32 space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#1F1F1F] tracking-tight mb-1">Documents</h1>
            <p className="text-sm text-[#999]">{documents.length} files · {documents.reduce((sum, doc) => sum + doc.sizeMb, 0).toFixed(1)} MB used</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md" icon={<Filter size={15} />} onClick={() => setCategoryFilter('All')}>Clear</Button>
            <Button variant="primary" size="md" icon={<Upload size={15} />} onClick={() => setUploadOpen(true)}>Upload</Button>
          </div>
        </motion.div>

        <motion.button
          type="button"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          onClick={() => setUploadOpen(true)}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            handleUpload(Array.from(event.dataTransfer.files), categories[0] ?? 'Research', ['Uploaded']);
          }}
          onDragOver={(event) => event.preventDefault()}
          className={cn(
            'w-full rounded-2xl border-2 border-dashed transition-all duration-300 p-8 text-center cursor-pointer focus-ring',
            isDragging ? 'border-[#E9A24C] bg-[rgba(233,162,76,0.06)] scale-[1.01]' : 'border-[rgba(0,0,0,0.08)] hover:border-[rgba(233,162,76,0.4)] hover:bg-[rgba(233,162,76,0.02)]'
          )}
        >
          <div className="flex flex-col items-center gap-3">
            <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300', isDragging ? 'bg-[rgba(233,162,76,0.15)]' : 'bg-[rgba(0,0,0,0.04)]')}>
              <Upload size={20} className={isDragging ? 'text-[#E9A24C]' : 'text-[#CCC]'} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1F1F1F]">{isDragging ? 'Drop to upload' : 'Drop files here or click to upload'}</p>
              <p className="text-xs text-[#999] mt-0.5">PDF, DOCX, XLSX, MD up to 50MB each</p>
            </div>
            {!isDragging && <span className="text-xs font-semibold text-[#E9A24C] hover:underline">Browse files</span>}
          </div>
        </motion.button>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between gap-4 mb-3">
            <h2 className="text-sm font-bold text-[#1F1F1F]">Categories</h2>
            <span className="text-xs text-[#999]">{availableTags.length} tags indexed</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {mockFolders.map((folder) => (
              <motion.button key={folder.name} type="button" whileHover={{ y: -3, scale: 1.02 }} onClick={() => { setCategoryFilter(folder.name); setViewMode('grid'); }} className={cn('bg-[#FFFDF8] rounded-2xl p-4 border shadow-card text-left flex items-center gap-3 focus-ring', categoryFilter === folder.name ? 'border-[rgba(233,162,76,0.35)]' : 'border-[rgba(0,0,0,0.05)]')}>
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', folder.color.split(' ')[0])}>
                  <Folder size={17} className={folder.color.split(' ')[1]} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1F1F1F]">{folder.name}</p>
                  <p className="text-xs text-[#999]">{documents.filter((doc) => doc.folder === folder.name).length || folder.count} files</p>
                </div>
              </motion.button>
            ))}
            <motion.button type="button" whileHover={{ y: -3 }} onClick={() => setUploadOpen(true)} className="bg-transparent rounded-2xl p-4 border-2 border-dashed border-[rgba(0,0,0,0.08)] flex items-center gap-3 hover:border-[rgba(233,162,76,0.4)] transition-all focus-ring">
              <div className="w-9 h-9 rounded-xl bg-[rgba(0,0,0,0.03)] flex items-center justify-center"><Plus size={16} className="text-[#CCC]" aria-hidden="true" /></div>
              <span className="text-sm text-[#CCC] font-medium">New category</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="bg-[#FFFDF8] rounded-2xl p-4 border border-[rgba(0,0,0,0.05)] shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Tags size={15} className="text-[#E9A24C]" aria-hidden="true" />
            <h2 className="text-sm font-bold text-[#1F1F1F]">Tags</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {['All', ...availableTags].map((tag) => (
              <button key={tag} type="button" onClick={() => setTagFilter(tag)} className={cn('shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all focus-ring', tagFilter === tag ? 'border-[rgba(233,162,76,0.4)] bg-[rgba(233,162,76,0.1)] text-[#E9A24C]' : 'border-[rgba(0,0,0,0.08)] text-[#666] hover:border-[rgba(233,162,76,0.3)]')}>
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="text-sm font-bold text-[#1F1F1F]">Recent Documents</h2>
            <Badge variant="accent" size="sm">{recentDocuments.length} recent</Badge>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {documentsQuery.isLoading && Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-24 rounded-2xl" />)}
            {!documentsQuery.isLoading && recentDocuments.map((doc) => {
              const typeInfo = typeIcons[doc.type];
              const Icon = typeInfo.icon;
              return (
                <button key={doc.id} type="button" onClick={() => setPreviewDocument(doc)} className="bg-[#FFFDF8] rounded-2xl p-3 border border-[rgba(0,0,0,0.05)] shadow-card text-left hover:border-[rgba(233,162,76,0.3)] transition-colors focus-ring">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', typeInfo.bg)}><Icon size={16} className={typeInfo.color} aria-hidden="true" /></div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#1F1F1F] truncate">{doc.name}</p>
                      <p className="text-[11px] text-[#999]">{doc.folder} · {doc.updatedAt}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#CCC]" aria-hidden="true" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} type="search" placeholder="Search documents, tags, categories..." className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-[#FFFDF8] border border-[rgba(0,0,0,0.08)] text-[#1F1F1F] placeholder:text-[#CCC] outline-none focus:border-[rgba(233,162,76,0.4)] shadow-card" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="rounded-xl bg-[#FFFDF8] border border-[rgba(0,0,0,0.06)] px-3 py-2.5 text-xs font-medium text-[#666] outline-none shadow-card focus:border-[rgba(233,162,76,0.4)]">
                {['All', ...categories].map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
              <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="rounded-xl bg-[#FFFDF8] border border-[rgba(0,0,0,0.06)] px-3 py-2.5 text-xs font-medium text-[#666] outline-none shadow-card focus:border-[rgba(233,162,76,0.4)]">
                {['All', 'pdf', 'xlsx', 'doc', 'md'].map((type) => <option key={type} value={type}>{type === 'All' ? 'All types' : type.toUpperCase()}</option>)}
              </select>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value as DocumentSort)} className="rounded-xl bg-[#FFFDF8] border border-[rgba(0,0,0,0.06)] px-3 py-2.5 text-xs font-medium text-[#666] outline-none shadow-card focus:border-[rgba(233,162,76,0.4)]">
                {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
              <div className="flex items-center gap-1 bg-[#FFFDF8] rounded-xl border border-[rgba(0,0,0,0.06)] p-1 shadow-card">
                <button type="button" aria-label="List view" onClick={() => setViewMode('list')} className={cn('p-1.5 rounded-lg transition-all focus-ring', viewMode === 'list' ? 'bg-[rgba(233,162,76,0.1)] text-[#E9A24C]' : 'text-[#CCC] hover:text-[#999]')}><List size={15} aria-hidden="true" /></button>
                <button type="button" aria-label="Grid view" onClick={() => setViewMode('grid')} className={cn('p-1.5 rounded-lg transition-all focus-ring', viewMode === 'grid' ? 'bg-[rgba(233,162,76,0.1)] text-[#E9A24C]' : 'text-[#CCC] hover:text-[#999]')}><Grid size={15} aria-hidden="true" /></button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4 text-xs text-[#999]">
            <ArrowUpDown size={13} className="text-[#E9A24C]" aria-hidden="true" />
            Showing {filteredDocuments.length} of {documents.length} documents
          </div>

          {viewMode === 'list' ? (
            <DataTable
              data={filteredDocuments}
              columns={columns}
              getRowId={(doc) => doc.id}
              loading={documentsQuery.isLoading}
              searchPlaceholder="Search documents..."
              emptyTitle="No documents found"
              emptyDescription="Upload a document or clear your filters."
              pageSize={5}
              ariaLabel="Documents table"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {documentsQuery.isLoading && Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-44 rounded-2xl" />)}
              {!documentsQuery.isLoading && filteredDocuments.map((doc) => {
                const typeInfo = typeIcons[doc.type];
                return (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    icon={typeInfo.icon}
                    iconClassName={typeInfo.color}
                    iconContainerClassName={typeInfo.bg}
                    hovered={hoveredDoc === doc.id}
                    onHoverStart={() => setHoveredDoc(doc.id)}
                    onHoverEnd={() => setHoveredDoc(null)}
                    onPreview={() => setPreviewDocument(doc)}
                    onToggleStar={() => toggleStar(doc.id)}
                    onDelete={() => setDeleteTarget(doc)}
                  />
                );
              })}
              {!documentsQuery.isLoading && filteredDocuments.length === 0 && (
                <div className="col-span-full text-center py-12 bg-[#FFFDF8] rounded-2xl border border-[rgba(0,0,0,0.05)] shadow-card">
                  <Sparkles size={22} className="text-[#E9A24C] mx-auto mb-3" aria-hidden="true" />
                  <p className="text-sm font-bold text-[#1F1F1F]">No documents found</p>
                  <p className="text-xs text-[#999] mt-1">Try a different search, filter, category, or upload a new file.</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      <DocumentUploadModal open={uploadOpen} categories={categories} onClose={() => setUploadOpen(false)} onUpload={handleUpload} />
      <DocumentPreviewModal document={previewDocument} onClose={() => setPreviewDocument(null)} />
      <DeleteDocumentDialog document={deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />
    </div>
  );
};

const TrashIcon = () => <FileText size={13} className="text-[#CCC] hover:text-red-400" aria-hidden="true" />;

export default DocumentsPage;
