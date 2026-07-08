import { API_ENDPOINTS } from '../endpoints';
import { apiClient } from '../client';
import type { ApiRequestConfig, PaginatedResponse } from '../types';
import type { ApiDocument, DocumentListRequest, DocumentUploadRequest, UpdateDocumentRequest } from '@/types/api';

export const documentsApi = {
  list: (request?: DocumentListRequest) => apiClient.get<PaginatedResponse<ApiDocument>>(API_ENDPOINTS.documents.root, { params: request }),
  recent: () => apiClient.get<ApiDocument[]>(API_ENDPOINTS.documents.recent),
  getById: (documentId: string) => apiClient.get<ApiDocument>(API_ENDPOINTS.documents.byId(documentId)),
  preview: (documentId: string) => apiClient.get<{ previewUrl: string }>(API_ENDPOINTS.documents.preview(documentId)),
  categories: () => apiClient.get<string[]>(API_ENDPOINTS.documents.categories),
  tags: () => apiClient.get<string[]>(API_ENDPOINTS.documents.tags),
  upload: ({ file, category, tags }: DocumentUploadRequest, config?: ApiRequestConfig) => {
    const formData = new FormData();
    formData.append('file', file);
    if (category) formData.append('category', category);
    tags?.forEach((tag) => formData.append('tags', tag));
    return apiClient.post<ApiDocument, FormData>(API_ENDPOINTS.documents.upload, formData, config);
  },
  update: (documentId: string, request: UpdateDocumentRequest) => apiClient.patch<ApiDocument, UpdateDocumentRequest>(API_ENDPOINTS.documents.byId(documentId), request),
  analyze: (documentId: string) => apiClient.post<ApiDocument>(API_ENDPOINTS.documents.analyze(documentId)),
  delete: (documentId: string) => apiClient.delete<{ success: boolean }>(API_ENDPOINTS.documents.byId(documentId)),
};
