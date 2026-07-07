import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { chatService } from '@/services/chat/chatService';
import type { ChatMessage, RecentChat } from '@/types/chat';

export const useChatMessages = () => {
  const queryClient = useQueryClient();
  const messagesQuery = useQuery({
    queryKey: queryKeys.chatMessages,
    queryFn: chatService.getMessages,
  });

  const addMessageMutation = useMutation({
    mutationFn: chatService.addMessage,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.chatMessages });
    },
  });

  return {
    messages: messagesQuery.data ?? [],
    isLoading: messagesQuery.isLoading,
    isError: messagesQuery.isError,
    error: messagesQuery.error,
    addMessage: (message: ChatMessage) => addMessageMutation.mutateAsync(message),
    isAddingMessage: addMessageMutation.isPending,
  };
};

export const useRecentChats = () => {
  const queryClient = useQueryClient();
  const recentChatsQuery = useQuery({
    queryKey: queryKeys.recentChats,
    queryFn: chatService.getRecentChats,
  });

  const addRecentChatMutation = useMutation({
    mutationFn: chatService.addRecentChat,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.recentChats });
      void queryClient.invalidateQueries({ queryKey: queryKeys.chatHistory });
    },
  });

  return {
    recentChats: recentChatsQuery.data ?? [],
    isLoading: recentChatsQuery.isLoading,
    isError: recentChatsQuery.isError,
    error: recentChatsQuery.error,
    addRecentChat: (chat: RecentChat) => addRecentChatMutation.mutateAsync(chat),
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
