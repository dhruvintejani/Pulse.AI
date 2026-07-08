import { useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '@/services/api';
import { queryKeys } from '@/constants/queryKeys';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useApiQuery } from '@/hooks/useApiQuery';
import type { DocumentListRequest, DocumentUploadRequest, UpdateDocumentRequest } from '@/types/api';

export const useApiDocuments = (request?: DocumentListRequest, enabled = false) => useApiQuery(
  [...queryKeys.api.documents, request] as const,
  () => documentsApi.list(request),
  { enabled }
);

export const useApiDocument = (documentId: string, enabled = false) => useApiQuery(
  queryKeys.api.document(documentId),
  () => documentsApi.getById(documentId),
  { enabled: enabled && Boolean(documentId) }
);

export const useUploadApiDocument = () => {
  const queryClient = useQueryClient();
  return useApiMutation(
    (request: DocumentUploadRequest) => documentsApi.upload(request),
    { onSuccess: () => void queryClient.invalidateQueries({ queryKey: queryKeys.api.documents }) }
  );
};

export const useUpdateApiDocument = (documentId: string) => {
  const queryClient = useQueryClient();
  return useApiMutation(
    (request: UpdateDocumentRequest) => documentsApi.update(documentId, request),
    {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: queryKeys.api.documents });
        void queryClient.invalidateQueries({ queryKey: queryKeys.api.document(documentId) });
      },
    }
  );
};

export const useDeleteApiDocument = () => {
  const queryClient = useQueryClient();
  return useApiMutation(
    (documentId: string) => documentsApi.delete(documentId),
    { onSuccess: () => void queryClient.invalidateQueries({ queryKey: queryKeys.api.documents }) }
  );
};
