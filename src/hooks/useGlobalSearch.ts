import { useCallback, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { globalSearchService } from '@/services/search';
import type { SearchEntityType } from '@/types/search';
import { useDebouncedValue } from './useDebouncedValue';

const defaultFilters: SearchEntityType[] = ['chat', 'message', 'document', 'user', 'setting'];

export const useGlobalSearch = () => {
  const queryClient = useQueryClient();
  const [query, setQueryState] = useState('');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<SearchEntityType[]>(defaultFilters);
  const debouncedQuery = useDebouncedValue(query, 320);

  const searchQuery = useQuery({
    queryKey: [...queryKeys.search, debouncedQuery, page, filters.join(',')],
    queryFn: () => globalSearchService.search({ query: debouncedQuery, page, size: 8, filters }),
    enabled: debouncedQuery.trim().length > 0,
    staleTime: 20_000,
  });

  const recentSearchesQuery = useQuery({
    queryKey: queryKeys.recentSearches,
    queryFn: globalSearchService.getRecentSearches,
    staleTime: 60_000,
  });

  const setQuery = useCallback((value: string) => {
    setQueryState(value);
    setPage(1);
  }, []);

  const toggleFilter = useCallback((filter: SearchEntityType) => {
    setPage(1);
    setFilters((current) => (
      current.includes(filter)
        ? current.filter((item) => item !== filter)
        : [...current, filter]
    ));
  }, []);

  const clearRecentSearches = useCallback(async () => {
    await globalSearchService.clearRecentSearches();
    await queryClient.invalidateQueries({ queryKey: queryKeys.recentSearches });
  }, [queryClient]);

  const recentSearches = searchQuery.data?.recent_searches ?? recentSearchesQuery.data ?? [];
  const items = searchQuery.data?.items ?? [];

  return useMemo(() => ({
    query,
    debouncedQuery,
    setQuery,
    page,
    setPage,
    filters,
    toggleFilter,
    availableFilters: defaultFilters,
    items,
    recentSearches,
    clearRecentSearches,
    total: searchQuery.data?.total ?? 0,
    hasNext: searchQuery.data?.has_next ?? false,
    isSearching: searchQuery.isFetching,
    isEmpty: debouncedQuery.trim().length > 0 && !searchQuery.isFetching && items.length === 0,
  }), [clearRecentSearches, debouncedQuery, filters, items, page, query, recentSearches, searchQuery.data?.has_next, searchQuery.data?.total, searchQuery.isFetching, setQuery, toggleFilter]);
};
