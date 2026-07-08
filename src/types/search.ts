export type SearchEntityType = 'chat' | 'message' | 'document' | 'user' | 'setting';

export interface SearchHighlight {
  field: string;
  snippet: string;
}

export interface GlobalSearchResult {
  id: string;
  type: SearchEntityType;
  title: string;
  description?: string | null;
  url?: string | null;
  score: number;
  highlights: SearchHighlight[];
  metadata: Record<string, unknown>;
  updated_at?: string | null;
}

export interface GlobalSearchResponse {
  query: string;
  filters: SearchEntityType[];
  items: GlobalSearchResult[];
  page: number;
  size: number;
  total: number;
  has_next: boolean;
  recent_searches: string[];
}

export interface GlobalSearchRequest {
  query: string;
  page?: number;
  size?: number;
  filters?: SearchEntityType[];
}
