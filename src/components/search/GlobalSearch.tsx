import { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Clock, Filter, Loader2, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { cn } from '@/lib/utils';
import type { GlobalSearchResult, SearchEntityType } from '@/types/search';

const filterLabels: Record<SearchEntityType, string> = {
  chat: 'Chats',
  message: 'Messages',
  document: 'Documents',
  user: 'Users',
  setting: 'Settings',
};

const filterVariants: Record<SearchEntityType, 'accent' | 'success' | 'warning' | 'neutral' | 'default'> = {
  chat: 'accent',
  message: 'default',
  document: 'success',
  user: 'warning',
  setting: 'neutral',
};

const cleanSnippet = (value?: string | null) => (value ?? '').replace(/<\/?mark>/g, '');

const HighlightedText = memo(({ text, query }: { text: string; query: string }) => {
  const segments = useMemo(() => {
    if (!query.trim()) return [{ text, match: false }];
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'ig');
    return text.split(regex).filter(Boolean).map((part) => ({
      text: part,
      match: part.toLowerCase() === query.toLowerCase(),
    }));
  }, [query, text]);

  return (
    <>
      {segments.map((segment, index) => (
        segment.match ? <mark key={`${segment.text}-${index}`} className="rounded bg-[rgba(233,162,76,0.22)] px-0.5 text-[#A56018]">{segment.text}</mark> : <span key={`${segment.text}-${index}`}>{segment.text}</span>
      ))}
    </>
  );
});
HighlightedText.displayName = 'HighlightedText';

const SearchResultCard = memo(({ result, query, onOpen }: { result: GlobalSearchResult; query: string; onOpen: (result: GlobalSearchResult) => void }) => {
  const snippet = cleanSnippet(result.highlights[0]?.snippet) || result.description || '';

  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      onClick={() => onOpen(result)}
      className="group w-full rounded-2xl border border-[rgba(0,0,0,0.05)] bg-white/65 p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(233,162,76,0.22)] hover:bg-[rgba(233,162,76,0.04)] hover:shadow-card focus-ring"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[rgba(233,162,76,0.1)]">
          <Search size={15} className="text-[#E9A24C]" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={filterVariants[result.type]} size="sm">{filterLabels[result.type]}</Badge>
                <h3 className="truncate text-sm font-black text-[#1F1F1F]">{result.title}</h3>
              </div>
              {snippet && (
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#666]">
                  <HighlightedText text={snippet} query={query} />
                </p>
              )}
            </div>
            <ChevronRight size={16} className="mt-1 shrink-0 text-[#CCC] transition-transform group-hover:translate-x-0.5 group-hover:text-[#E9A24C]" aria-hidden="true" />
          </div>
        </div>
      </div>
    </motion.button>
  );
});
SearchResultCard.displayName = 'SearchResultCard';

const GlobalSearch = () => {
  const navigate = useNavigate();
  const searchState = useGlobalSearch();

  const handleOpen = (result: GlobalSearchResult) => {
    if (result.url) navigate(result.url);
  };

  return (
    <section className="rounded-2xl border border-[rgba(0,0,0,0.05)] bg-[#FFFDF8]/85 p-3 shadow-card backdrop-blur-xl" aria-label="Global search">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search chats, messages, documents, users, and settings</span>
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" aria-hidden="true" />
          <input
            value={searchState.query}
            onChange={(event) => searchState.setQuery(event.target.value)}
            placeholder="Search chats, messages, documents, users, settings..."
            className="input-premium w-full rounded-xl py-3 pl-10 pr-10 text-sm font-medium text-[#1F1F1F] outline-none placeholder:text-[#999]"
          />
          {searchState.query && (
            <button type="button" onClick={() => searchState.setQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#999] transition-colors hover:bg-[rgba(0,0,0,0.04)] hover:text-[#1F1F1F] focus-ring" aria-label="Clear search">
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </label>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar" aria-label="Search filters">
          <span className="hidden items-center gap-1 text-xs font-semibold text-[#999] sm:flex"><Filter size={13} /> Filters</span>
          {searchState.availableFilters.map((filter) => {
            const active = searchState.filters.includes(filter);
            return (
              <button
                key={filter}
                type="button"
                onClick={() => searchState.toggleFilter(filter)}
                aria-pressed={active}
                className={cn('shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold transition-all duration-200 focus-ring', active ? 'border-[rgba(233,162,76,0.28)] bg-[rgba(233,162,76,0.12)] text-[#A56018]' : 'border-[rgba(0,0,0,0.06)] text-[#999] hover:text-[#666]')}
              >
                {filterLabels[filter]}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {searchState.query.trim() ? (
          <motion.div key="results" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-3 space-y-2">
            <div className="flex items-center justify-between gap-3 px-1">
              <p className="text-xs font-semibold text-[#999]">
                {searchState.isSearching ? 'Searching...' : `${searchState.total} results`}
              </p>
              {searchState.isSearching && <Loader2 size={14} className="animate-spin text-[#E9A24C]" aria-hidden="true" />}
            </div>

            {searchState.isEmpty ? (
              <div className="rounded-2xl border border-[rgba(0,0,0,0.05)] bg-white/60 p-4">
                <EmptyState title="No matches found" description="Try another keyword or enable more filters." />
              </div>
            ) : (
              <div className="grid gap-2">
                {searchState.items.map((result) => <SearchResultCard key={`${result.type}-${result.id}`} result={result} query={searchState.debouncedQuery} onOpen={handleOpen} />)}
              </div>
            )}

            {(searchState.page > 1 || searchState.hasNext) && (
              <div className="flex items-center justify-end gap-2 pt-1">
                <button type="button" disabled={searchState.page === 1} onClick={() => searchState.setPage(Math.max(1, searchState.page - 1))} className="rounded-lg px-3 py-1.5 text-xs font-bold text-[#666] transition-colors hover:bg-[rgba(233,162,76,0.08)] disabled:cursor-not-allowed disabled:opacity-40 focus-ring">Previous</button>
                <button type="button" disabled={!searchState.hasNext} onClick={() => searchState.setPage(searchState.page + 1)} className="rounded-lg px-3 py-1.5 text-xs font-bold text-[#666] transition-colors hover:bg-[rgba(233,162,76,0.08)] disabled:cursor-not-allowed disabled:opacity-40 focus-ring">Next</button>
              </div>
            )}
          </motion.div>
        ) : searchState.recentSearches.length ? (
          <motion.div key="recent" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-3 rounded-2xl border border-[rgba(0,0,0,0.05)] bg-white/50 p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#999]"><Clock size={13} /> Recent searches</p>
              <button type="button" onClick={() => void searchState.clearRecentSearches()} className="text-xs font-bold text-[#999] transition-colors hover:text-[#E9A24C] focus-ring rounded-md">Clear</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchState.recentSearches.map((item) => (
                <button key={item} type="button" onClick={() => searchState.setQuery(item)} className="rounded-full border border-[rgba(0,0,0,0.06)] px-3 py-1.5 text-xs font-semibold text-[#666] transition-colors hover:border-[rgba(233,162,76,0.3)] hover:bg-[rgba(233,162,76,0.08)] focus-ring">{item}</button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
};

export default memo(GlobalSearch);
