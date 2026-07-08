import { useQueryClient } from '@tanstack/react-query';
import { conversationsApi } from '@/services/api';
import { queryKeys } from '@/constants/queryKeys';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useApiQuery } from '@/hooks/useApiQuery';
import type {
  ConversationListRequest,
  CreateConversationRequest,
  MessageReactionRequest,
  RegenerateMessageRequest,
  RenameConversationRequest,
  SendMessageRequest,
} from '@/types/api';

export const useApiConversations = (request?: ConversationListRequest, enabled = false) => useApiQuery(
  [...queryKeys.api.conversations, request] as const,
  () => conversationsApi.list(request),
  { enabled }
);

export const useApiConversation = (conversationId: string, enabled = false) => useApiQuery(
  queryKeys.api.conversation(conversationId),
  () => conversationsApi.getById(conversationId),
  { enabled: enabled && Boolean(conversationId) }
);

export const useApiConversationMessages = (conversationId: string, enabled = false) => useApiQuery(
  queryKeys.api.conversationMessages(conversationId),
  () => conversationsApi.listMessages(conversationId),
  { enabled: enabled && Boolean(conversationId) }
);

export const useCreateApiConversation = () => {
  const queryClient = useQueryClient();
  return useApiMutation(
    (request: CreateConversationRequest) => conversationsApi.create(request),
    { onSuccess: () => void queryClient.invalidateQueries({ queryKey: queryKeys.api.conversations }) }
  );
};

export const useRenameApiConversation = (conversationId: string) => {
  const queryClient = useQueryClient();
  return useApiMutation(
    (request: RenameConversationRequest) => conversationsApi.rename(conversationId, request),
    {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: queryKeys.api.conversations });
        void queryClient.invalidateQueries({ queryKey: queryKeys.api.conversation(conversationId) });
      },
    }
  );
};

export const useSendApiMessage = (conversationId: string) => {
  const queryClient = useQueryClient();
  return useApiMutation(
    (request: SendMessageRequest) => conversationsApi.sendMessage(conversationId, request),
    { onSuccess: () => void queryClient.invalidateQueries({ queryKey: queryKeys.api.conversationMessages(conversationId) }) }
  );
};

export const useUpdateApiMessageReaction = (conversationId: string, messageId: string) => {
  const queryClient = useQueryClient();
  return useApiMutation(
    (request: MessageReactionRequest) => conversationsApi.updateReaction(conversationId, messageId, request),
    { onSuccess: () => void queryClient.invalidateQueries({ queryKey: queryKeys.api.conversationMessages(conversationId) }) }
  );
};

export const useRegenerateApiMessage = (conversationId: string, messageId: string) => {
  const queryClient = useQueryClient();
  return useApiMutation(
    (request?: RegenerateMessageRequest) => conversationsApi.regenerateMessage(conversationId, messageId, request),
    { onSuccess: () => void queryClient.invalidateQueries({ queryKey: queryKeys.api.conversationMessages(conversationId) }) }
  );
};

export const useDeleteApiConversation = () => {
  const queryClient = useQueryClient();
  return useApiMutation(
    (conversationId: string) => conversationsApi.delete(conversationId),
    { onSuccess: () => void queryClient.invalidateQueries({ queryKey: queryKeys.api.conversations }) }
  );
};
