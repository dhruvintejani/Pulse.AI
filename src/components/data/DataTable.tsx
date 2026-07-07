import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import Skeleton from '@/components/ui/Skeleton';

export interface DataTableColumn<T> {
  id: string;
  header: string;
  accessor: (row: T) => string | number | boolean | null | undefined;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  filterOptions?: Array<{ label: string; value: string }>;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;
  searchPlaceholder?: string;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  pageSize?: number;
  className?: string;
}

type SortDirection = 'asc' | 'desc';

const normalizeValue = (value: string | number | boolean | null | undefined) => String(value ?? '').toLowerCase();

const DataTable = <T,>({
  data,
  columns,
  getRowId,
  searchPlaceholder = 'Search...',
  loading = false,
  emptyTitle = 'No results found',
  emptyDescription = 'Try changing your search or filter.',
  pageSize = 5,
  className,
}: DataTableProps<T>) => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState(columns.find((column) => column.sortable)?.id ?? columns[0]?.id ?? '');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);

  const searchableColumns = useMemo(() => columns.filter((column) => column.filterable !== false), [columns]);
  const filterColumns = useMemo(() => columns.filter((column) => column.filterOptions?.length), [columns]);
  const totalColumns = columns.length;

  const filteredData = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return data.filter((row) => {
      const matchesSearch = !normalizedSearch || searchableColumns.some((column) => (
        normalizeValue(column.accessor(row)).includes(normalizedSearch)
      ));

      const matchesFilters = Object.entries(filters).every(([columnId, value]) => {
        if (!value) return true;
        const column = columns.find((item) => item.id === columnId);
        if (!column) return true;
        return normalizeValue(column.accessor(row)) === value.toLowerCase();
      });

      return matchesSearch && matchesFilters;
    });
  }, [columns, data, filters, search, searchableColumns]);

  const sortedData = useMemo(() => {
    const column = columns.find((item) => item.id === sortBy);
    if (!column) return filteredData;

    return [...filteredData].sort((a, b) => {
      const first = column.accessor(a);
      const second = column.accessor(b);
      const firstValue = typeof first === 'number' ? first : normalizeValue(first);
      const secondValue = typeof second === 'number' ? second : normalizeValue(second);
      if (firstValue < secondValue) return sortDirection === 'asc' ? -1 : 1;
      if (firstValue > secondValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [columns, filteredData, sortBy, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedData = sortedData.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleSort = (column: DataTableColumn<T>) => {
    if (!column.sortable) return;
    if (sortBy === column.id) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column.id);
      setSortDirection('asc');
    }
    setPage(1);
  };

  const updateFilter = (columnId: string, value: string) => {
    setFilters((current) => ({ ...current, [columnId]: value }));
    setPage(1);
  };

  return (
    <div className={cn('bg-[#FFFDF8] rounded-2xl border border-[rgba(0,0,0,0.05)] shadow-card overflow-hidden', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b border-[rgba(0,0,0,0.05)]">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#CCC]" />
          <input
            value={search}
            onChange={(event) => { setSearch(event.target.value); setPage(1); }}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-[rgba(0,0,0,0.03)] border border-[rgba(0,0,0,0.06)] text-[#1F1F1F] placeholder:text-[#CCC] outline-none focus:border-[rgba(233,162,76,0.4)]"
          />
        </div>
        {filterColumns.map((column) => (
          <div key={column.id} className="relative">
            <select
              value={filters[column.id] ?? ''}
              onChange={(event) => updateFilter(column.id, event.target.value)}
              className="appearance-none min-w-36 pr-8 pl-3 py-2.5 text-xs font-medium rounded-xl bg-[rgba(0,0,0,0.03)] border border-[rgba(0,0,0,0.06)] text-[#666] outline-none focus:border-[rgba(233,162,76,0.4)]"
            >
              <option value="">All {column.header}</option>
              {column.filterOptions?.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#CCC]" />
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-[rgba(0,0,0,0.05)]">
              {columns.map((column) => (
                <th key={column.id} className={cn('px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#999]', column.className)}>
                  <button
                    type="button"
                    onClick={() => toggleSort(column)}
                    className={cn('inline-flex items-center gap-1.5', column.sortable && 'hover:text-[#E9A24C] transition-colors')}
                  >
                    {column.header}
                    {column.sortable && <ChevronsUpDown size={11} className={sortBy === column.id ? 'text-[#E9A24C]' : 'text-[#CCC]'} />}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && Array.from({ length: pageSize }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-[rgba(0,0,0,0.04)] last:border-0">
                {columns.map((column) => (
                  <td key={column.id} className="px-4 py-4"><Skeleton className="h-4 w-28" /></td>
                ))}
              </tr>
            ))}

            {!loading && paginatedData.map((row) => (
              <tr key={getRowId(row)} className="border-b border-[rgba(0,0,0,0.04)] last:border-0 hover:bg-[rgba(233,162,76,0.03)] transition-colors">
                {columns.map((column) => (
                  <td key={column.id} className={cn('px-4 py-3 text-sm text-[#666]', column.className)}>
                    {column.render ? column.render(row) : column.accessor(row)}
                  </td>
                ))}
              </tr>
            ))}

            {!loading && paginatedData.length === 0 && (
              <tr>
                <td colSpan={totalColumns} className="px-4 py-12 text-center">
                  <p className="text-sm font-bold text-[#1F1F1F]">{emptyTitle}</p>
                  <p className="text-xs text-[#999] mt-1">{emptyDescription}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-[rgba(0,0,0,0.05)]">
        <p className="text-xs text-[#999]">
          Showing {sortedData.length ? (safePage - 1) * pageSize + 1 : 0}-{Math.min(safePage * pageSize, sortedData.length)} of {sortedData.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={safePage === 1}
            className="p-1.5 rounded-lg border border-[rgba(0,0,0,0.06)] text-[#999] disabled:opacity-40 hover:text-[#E9A24C] transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-xs font-semibold text-[#666]">{safePage} / {totalPages}</span>
          <button
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={safePage === totalPages}
            className="p-1.5 rounded-lg border border-[rgba(0,0,0,0.06)] text-[#999] disabled:opacity-40 hover:text-[#E9A24C] transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
