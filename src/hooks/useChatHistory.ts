import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { queryKeys } from '@/constants/queryKeys';
import { chatService } from '@/services/chat/chatService';
import type { ConversationMessagePayload, MessageReactionPayload, RenameConversationPayload } from '@/types/chat';

const invalidateChatQueries = (queryClient: QueryClient) => {
  void queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
  void queryClient.invalidateQueries({ queryKey: queryKeys.activeConversation });
  void queryClient.invalidateQueries({ queryKey: queryKeys.chatMessages });
  void queryClient.invalidateQueries({ queryKey: queryKeys.chatHistory });
  void queryClient.invalidateQueries({ queryKey: queryKeys.recentChats });
};

export const useConversations = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  const conversationsQuery = useQuery({
    queryKey: [...queryKeys.conversations, searchQuery],
    queryFn: () => chatService.searchConversations(searchQuery),
  });

  const activeConversationQuery = useQuery({
    queryKey: queryKeys.activeConversation,
    queryFn: chatService.getActiveConversation,
  });

  const createConversationMutation = useMutation({
    mutationFn: chatService.createConversation,
    onSuccess: () => invalidateChatQueries(queryClient),
  });

  const setActiveConversationMutation = useMutation({
    mutationFn: chatService.setActiveConversation,
    onSuccess: () => invalidateChatQueries(queryClient),
  });

  const deleteConversationMutation = useMutation({
    mutationFn: chatService.deleteConversation,
    onSuccess: () => invalidateChatQueries(queryClient),
  });

  const renameConversationMutation = useMutation({
    mutationFn: chatService.renameConversation,
    onSuccess: () => invalidateChatQueries(queryClient),
  });

  const togglePinnedMutation = useMutation({
    mutationFn: chatService.togglePinned,
    onSuccess: () => invalidateChatQueries(queryClient),
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: chatService.toggleFavorite,
    onSuccess: () => invalidateChatQueries(queryClient),
  });

  const conversations = conversationsQuery.data ?? [];

  const groupedConversations = useMemo(() => ({
    pinned: conversations.filter((conversation) => conversation.pinned),
    favorites: conversations.filter((conversation) => conversation.favorite && !conversation.pinned),
    today: conversations.filter((conversation) => conversation.period === 'today' && !conversation.pinned && !conversation.favorite),
    yesterday: conversations.filter((conversation) => conversation.period === 'yesterday' && !conversation.pinned && !conversation.favorite),
  }), [conversations]);

  return {
    conversations,
    groupedConversations,
    activeConversation: activeConversationQuery.data ?? null,
    searchQuery,
    setSearchQuery,
    isLoading: conversationsQuery.isLoading || activeConversationQuery.isLoading,
    isError: conversationsQuery.isError || activeConversationQuery.isError,
    error: conversationsQuery.error ?? activeConversationQuery.error,
    createConversation: createConversationMutation.mutateAsync,
    setActiveConversation: setActiveConversationMutation.mutateAsync,
    deleteConversation: deleteConversationMutation.mutateAsync,
    renameConversation: (payload: RenameConversationPayload) => renameConversationMutation.mutateAsync(payload),
    togglePinned: togglePinnedMutation.mutateAsync,
    toggleFavorite: toggleFavoriteMutation.mutateAsync,
    isMutating:
      createConversationMutation.isPending ||
      setActiveConversationMutation.isPending ||
      deleteConversationMutation.isPending ||
      renameConversationMutation.isPending ||
      togglePinnedMutation.isPending ||
      toggleFavoriteMutation.isPending,
  };
};

export const useChatMessages = () => {
  const queryClient = useQueryClient();
  const activeConversationQuery = useQuery({
    queryKey: queryKeys.activeConversation,
    queryFn: chatService.getActiveConversation,
  });

  const messagesQuery = useQuery({
    queryKey: [...queryKeys.chatMessages, activeConversationQuery.data?.id],
    enabled: Boolean(activeConversationQuery.data?.id),
    queryFn: chatService.getMessages,
  });

  const addMessageMutation = useMutation({
    mutationFn: chatService.addMessage,
    onSuccess: () => invalidateChatQueries(queryClient),
  });

  const addAssistantReplyMutation = useMutation({
    mutationFn: chatService.addAssistantReply,
    onSuccess: () => invalidateChatQueries(queryClient),
  });

  const regenerateMutation = useMutation({
    mutationFn: chatService.regenerateLastAssistantMessage,
    onSuccess: () => invalidateChatQueries(queryClient),
  });

  const updateReactionMutation = useMutation({
    mutationFn: chatService.updateMessageReaction,
    onSuccess: () => invalidateChatQueries(queryClient),
  });

  return {
    activeConversation: activeConversationQuery.data ?? null,
    messages: messagesQuery.data ?? [],
    isLoading: activeConversationQuery.isLoading || messagesQuery.isLoading,
    isError: activeConversationQuery.isError || messagesQuery.isError,
    error: activeConversationQuery.error ?? messagesQuery.error,
    addMessage: (payload: ConversationMessagePayload) => addMessageMutation.mutateAsync(payload),
    addAssistantReply: (conversationId: string) => addAssistantReplyMutation.mutateAsync(conversationId),
    regenerateLastAssistantMessage: (conversationId: string) => regenerateMutation.mutateAsync(conversationId),
    updateMessageReaction: (payload: MessageReactionPayload) => updateReactionMutation.mutateAsync(payload),
    isAddingMessage: addMessageMutation.isPending || addAssistantReplyMutation.isPending,
    isRegenerating: regenerateMutation.isPending,
    isUpdatingReaction: updateReactionMutation.isPending,
  };
};

export const useRecentChats = () => {
  const recentChatsQuery = useQuery({
    queryKey: queryKeys.recentChats,
    queryFn: chatService.getRecentChats,
  });

  return {
    recentChats: recentChatsQuery.data ?? [],
    isLoading: recentChatsQuery.isLoading,
    isError: recentChatsQuery.isError,
    error: recentChatsQuery.error,
  };
};

export const useChatHistory = () => {
  const chatHistoryQuery = useQuery({
    queryKey: queryKeys.chatHistory,
    queryFn: chatService.getChatHistory,
  });

  return {
    chatHistory: chatHistoryQuery.data ?? [],
    todayChats: (chatHistoryQuery.data ?? []).filter((chat) => chat.period === 'today'),
    yesterdayChats: (chatHistoryQuery.data ?? []).filter((chat) => chat.period === 'yesterday'),
    isLoading: chatHistoryQuery.isLoading,
    isError: chatHistoryQuery.isError,
    error: chatHistoryQuery.error,
  };
};
