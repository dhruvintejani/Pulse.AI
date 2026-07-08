import { memo, useCallback, useDeferredValue, useId, useMemo, useState } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown, Inbox, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import EmptyState from '@/components/ui/EmptyState';
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
  data: readonly T[];
  columns: readonly DataTableColumn<T>[];
  getRowId: (row: T) => string;
  searchPlaceholder?: string;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  pageSize?: number;
  className?: string;
  ariaLabel?: string;
}

type SortDirection = 'asc' | 'desc';

const normalizeValue = (value: string | number | boolean | null | undefined) => String(value ?? '').toLowerCase();

const DataTableComponent = <T,>({
  data,
  columns,
  getRowId,
  searchPlaceholder = 'Search...',
  loading = false,
  emptyTitle = 'No results found',
  emptyDescription = 'Try changing your search or filter.',
  pageSize = 5,
  className,
  ariaLabel = 'Data table',
}: DataTableProps<T>) => {
  const searchId = useId();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState(columns.find((column) => column.sortable)?.id ?? columns[0]?.id ?? '');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(search);

  const searchableColumns = useMemo(() => columns.filter((column) => column.filterable !== false), [columns]);
  const filterColumns = useMemo(() => columns.filter((column) => column.filterOptions?.length), [columns]);
  const skeletonRows = useMemo(() => Array.from({ length: pageSize }), [pageSize]);
  const totalColumns = columns.length;

  const filteredData = useMemo(() => {
    const normalizedSearch = deferredSearch.trim().toLowerCase();

    return data.filter((row) => {
      const matchesSearch = !normalizedSearch || searchableColumns.some((column) => normalizeValue(column.accessor(row)).includes(normalizedSearch));
      const matchesFilters = Object.entries(filters).every(([columnId, value]) => {
        if (!value) return true;
        const column = columns.find((item) => item.id === columnId);
        if (!column) return true;
        return normalizeValue(column.accessor(row)) === value.toLowerCase();
      });

      return matchesSearch && matchesFilters;
    });
  }, [columns, data, deferredSearch, filters, searchableColumns]);

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

  const totalPages = useMemo(() => Math.max(1, Math.ceil(sortedData.length / pageSize)), [pageSize, sortedData.length]);
  const safePage = useMemo(() => Math.min(page, totalPages), [page, totalPages]);
  const paginatedData = useMemo(() => sortedData.slice((safePage - 1) * pageSize, safePage * pageSize), [pageSize, safePage, sortedData]);

  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  }, []);

  const toggleSort = useCallback((column: DataTableColumn<T>) => {
    if (!column.sortable) return;
    if (sortBy === column.id) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column.id);
      setSortDirection('asc');
    }
    setPage(1);
  }, [sortBy]);

  const updateFilter = useCallback((columnId: string, value: string) => {
    setFilters((current) => ({ ...current, [columnId]: value }));
    setPage(1);
  }, []);

  const goToPreviousPage = useCallback(() => {
    setPage((current) => Math.max(1, current - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setPage((current) => Math.min(totalPages, current + 1));
  }, [totalPages]);

  return (
    <div className={cn('ds-card w-full min-w-0 overflow-hidden p-0', className)}>
      <div className="flex flex-col gap-3 border-b border-[var(--ds-color-border)] p-3 sm:flex-row sm:flex-wrap sm:items-center sm:p-4">
        <div className="relative min-w-0 flex-1">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ds-color-subtle)]" aria-hidden="true" />
          <label className="sr-only" htmlFor={searchId}>Search table</label>
          <input
            id={searchId}
            type="search"
            value={search}
            onChange={handleSearchChange}
            placeholder={searchPlaceholder}
            aria-label="Search table"
            className="ds-control w-full py-2.5 pl-9 pr-4 text-sm placeholder:text-[var(--ds-color-subtle)]"
          />
        </div>
        <div className="flex min-w-0 flex-wrap gap-2">
          {filterColumns.map((column) => (
            <div key={column.id} className="relative min-w-[min(11rem,100%)] flex-1 sm:flex-none">
              <select
                value={filters[column.id] ?? ''}
                onChange={(event) => updateFilter(column.id, event.target.value)}
                aria-label={`Filter by ${column.header}`}
                className="ds-control w-full appearance-none py-2.5 pl-3 pr-8 text-xs font-semibold text-[var(--ds-color-muted)] sm:min-w-36"
              >
                <option value="">All {column.header}</option>
                {column.filterOptions?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ds-color-subtle)]" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-full overflow-x-auto overscroll-x-contain ds-scrollbar">
        <table className="w-full min-w-[680px] table-auto" aria-label={ariaLabel} aria-busy={loading || undefined}>
          <caption className="sr-only">{ariaLabel}</caption>
          <thead>
            <tr className="border-b border-[var(--ds-color-border)]">
              {columns.map((column) => {
                const activeSort = sortBy === column.id;
                return (
                  <th key={column.id} scope="col" aria-sort={activeSort ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'} className={cn('whitespace-nowrap px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--ds-color-subtle)]', column.className)}>
                    <button type="button" onClick={() => toggleSort(column)} disabled={!column.sortable} aria-label={column.sortable ? `Sort by ${column.header}` : column.header} className={cn('inline-flex items-center gap-1.5 rounded-md ds-focus-ring', column.sortable && 'transition-colors hover:text-[var(--ds-color-accent)]', !column.sortable && 'cursor-default')}>
                      {column.header}
                      {column.sortable && <ChevronsUpDown size={11} className={activeSort ? 'text-[var(--ds-color-accent)]' : 'text-[var(--ds-color-subtle)]'} aria-hidden="true" />}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading && skeletonRows.map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-[var(--ds-color-border)] last:border-0">
                {columns.map((column) => <td key={column.id} className="px-4 py-4"><Skeleton className="h-4 w-28" /></td>)}
              </tr>
            ))}

            {!loading && paginatedData.map((row) => (
              <tr key={getRowId(row)} className="border-b border-[var(--ds-color-border)] transition-colors last:border-0 hover:bg-[var(--ds-color-accent-soft)] motion-reduce:transition-none">
                {columns.map((column) => (
                  <td key={column.id} className={cn('px-4 py-3 text-sm text-[var(--ds-color-muted)]', column.className)}>
                    {column.render ? column.render(row) : column.accessor(row)}
                  </td>
                ))}
              </tr>
            ))}

            {!loading && paginatedData.length === 0 && (
              <tr>
                <td colSpan={totalColumns} className="px-4 py-4 text-center">
                  <EmptyState title={emptyTitle} description={emptyDescription} icon={<Inbox size={19} />} className="py-12" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-[var(--ds-color-border)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[var(--ds-color-subtle)]" aria-live="polite">
          Showing {sortedData.length ? (safePage - 1) * pageSize + 1 : 0}-{Math.min(safePage * pageSize, sortedData.length)} of {sortedData.length}
        </p>
        <div className="flex items-center justify-between gap-2 sm:justify-end">
          <button type="button" onClick={goToPreviousPage} disabled={safePage === 1} aria-label="Go to previous page" className="rounded-lg border border-[var(--ds-color-border)] p-2 text-[var(--ds-color-subtle)] transition-colors hover:text-[var(--ds-color-accent)] disabled:opacity-40 ds-focus-ring">
            <ChevronLeft size={14} aria-hidden="true" />
          </button>
          <span className="text-xs font-semibold text-[var(--ds-color-muted)]" aria-label={`Page ${safePage} of ${totalPages}`}>{safePage} / {totalPages}</span>
          <button type="button" onClick={goToNextPage} disabled={safePage === totalPages} aria-label="Go to next page" className="rounded-lg border border-[var(--ds-color-border)] p-2 text-[var(--ds-color-subtle)] transition-colors hover:text-[var(--ds-color-accent)] disabled:opacity-40 ds-focus-ring">
            <ChevronRight size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

const DataTable = memo(DataTableComponent) as typeof DataTableComponent;

export default DataTable;
