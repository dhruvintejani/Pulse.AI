import { API_ENDPOINTS } from '../endpoints';
import { apiClient } from '../client';
import type { PaginatedResponse } from '../types';
import type {
  ApiChatMessage,
  ApiConversation,
  ConversationListRequest,
  CreateConversationRequest,
  MessageReactionRequest,
  RegenerateMessageRequest,
  RenameConversationRequest,
  SendMessageRequest,
} from '@/types/api';

export const conversationsApi = {
  list: (request?: ConversationListRequest) => apiClient.get<PaginatedResponse<ApiConversation>>(API_ENDPOINTS.conversations.root, { params: request }),
  getById: (conversationId: string) => apiClient.get<ApiConversation>(API_ENDPOINTS.conversations.byId(conversationId)),
  create: (request: CreateConversationRequest) => apiClient.post<ApiConversation, CreateConversationRequest>(API_ENDPOINTS.conversations.root, request),
  rename: (conversationId: string, request: RenameConversationRequest) => apiClient.patch<ApiConversation, RenameConversationRequest>(API_ENDPOINTS.conversations.rename(conversationId), request),
  delete: (conversationId: string) => apiClient.delete<{ success: boolean }>(API_ENDPOINTS.conversations.byId(conversationId)),
  togglePinned: (conversationId: string) => apiClient.patch<ApiConversation>(API_ENDPOINTS.conversations.pin(conversationId)),
  toggleFavorite: (conversationId: string) => apiClient.patch<ApiConversation>(API_ENDPOINTS.conversations.favorite(conversationId)),
  listMessages: (conversationId: string) => apiClient.get<ApiChatMessage[]>(API_ENDPOINTS.conversations.messages(conversationId)),
  sendMessage: (conversationId: string, request: SendMessageRequest) => apiClient.post<ApiChatMessage, SendMessageRequest>(API_ENDPOINTS.conversations.messages(conversationId), request),
  updateReaction: (conversationId: string, messageId: string, request: MessageReactionRequest) => apiClient.patch<ApiChatMessage, MessageReactionRequest>(API_ENDPOINTS.conversations.reaction(conversationId, messageId), request),
  regenerateMessage: (conversationId: string, messageId: string, request?: RegenerateMessageRequest) => apiClient.post<ApiChatMessage, RegenerateMessageRequest | undefined>(API_ENDPOINTS.conversations.regenerate(conversationId, messageId), request),
};
