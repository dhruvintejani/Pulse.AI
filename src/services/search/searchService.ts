import { apiClient } from '@/services/api';
import type { GlobalSearchRequest, GlobalSearchResponse, GlobalSearchResult, SearchEntityType } from '@/types/search';

const defaultSearchFilters: SearchEntityType[] = ['chat', 'message', 'document', 'user', 'setting'];

const mockResults: GlobalSearchResult[] = [
  {
    id: 'mock-chat-1',
    type: 'chat',
    title: 'Market Research Q3 2025',
    description: 'Competitive landscape, product insights, and AI-generated opportunities.',
    url: '/dashboard/chat',
    score: 98,
    highlights: [{ field: 'title', snippet: '<mark>Market</mark> Research Q3 2025' }],
    metadata: { messages: 24 },
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-doc-1',
    type: 'document',
    title: 'Product Roadmap.pdf',
    description: 'Roadmap summary, timelines, and key decisions.',
    url: '/dashboard/documents',
    score: 88,
    highlights: [{ field: 'title', snippet: 'Product <mark>Roadmap</mark>.pdf' }],
    metadata: { kind: 'pdf' },
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-settings-1',
    type: 'setting',
    title: 'Settings · Theme',
    description: 'Theme, appearance, language, timezone, privacy, and notification preferences.',
    url: '/dashboard/settings',
    score: 72,
    highlights: [{ field: 'settings', snippet: '<mark>Theme</mark>, appearance, and preferences' }],
    metadata: { field: 'theme' },
    updated_at: new Date().toISOString(),
  },
];

const recentKey = 'pulse-recent-searches';

const getLocalRecentSearches = () => {
  try {
    const value = window.localStorage.getItem(recentKey);
    return value ? JSON.parse(value) as string[] : [];
  } catch {
    return [];
  }
};

const setLocalRecentSearch = (query: string) => {
  try {
    const normalized = query.trim();
    const next = [normalized, ...getLocalRecentSearches().filter((item) => item.toLowerCase() !== normalized.toLowerCase())].slice(0, 8);
    window.localStorage.setItem(recentKey, JSON.stringify(next));
    return next;
  } catch {
    return [];
  }
};

const filterMockResults = (query: string, filters?: SearchEntityType[]) => {
  const normalized = query.toLowerCase();
  const activeFilters = filters?.length ? filters : defaultSearchFilters;
  return mockResults.filter((item) => (
    activeFilters.includes(item.type) && `${item.title} ${item.description ?? ''}`.toLowerCase().includes(normalized)
  ));
};

export const globalSearchService = {
  search: async ({ query, page = 1, size = 8, filters }: GlobalSearchRequest): Promise<GlobalSearchResponse> => {
    const params = new URLSearchParams();
    params.set('q', query);
    params.set('page', String(page));
    params.set('size', String(size));
    filters?.forEach((filter) => params.append('filters', filter));

    try {
      return await apiClient.get<GlobalSearchResponse>(`/search?${params.toString()}`);
    } catch {
      const items = query.trim() ? filterMockResults(query, filters) : [];
      const recent = query.trim() ? setLocalRecentSearch(query) : getLocalRecentSearches();
      const start = (page - 1) * size;
      const end = start + size;
      return {
        query,
        filters: filters?.length ? filters : defaultSearchFilters,
        items: items.slice(start, end),
        page,
        size,
        total: items.length,
        has_next: end < items.length,
        recent_searches: recent,
      };
    }
  },

  getRecentSearches: async () => {
    try {
      const response = await apiClient.get<{ items: string[] }>('/settings/me/recent-searches');
      return response.items;
    } catch {
      return getLocalRecentSearches();
    }
  },

  clearRecentSearches: async () => {
    try {
      await apiClient.delete('/settings/me/recent-searches');
    } catch {
      window.localStorage.removeItem(recentKey);
    }
  },
};
