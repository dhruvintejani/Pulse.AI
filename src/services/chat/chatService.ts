import { CHAT_HISTORY, INITIAL_MESSAGES, RECENT_CHATS } from '@/constants/chat';
import type { ChatMessage, RecentChat } from '@/types/chat';

let messagesStore: ChatMessage[] = [...INITIAL_MESSAGES];
let recentChatsStore: RecentChat[] = [...RECENT_CHATS];
let chatHistoryStore: RecentChat[] = [...CHAT_HISTORY];

export const chatService = {
  getMessages: async () => messagesStore,
  getRecentChats: async () => recentChatsStore,
  getChatHistory: async () => chatHistoryStore,
  addMessage: async (message: ChatMessage) => {
    messagesStore = [...messagesStore, message];
    return message;
  },
  addRecentChat: async (chat: RecentChat) => {
    recentChatsStore = [chat, ...recentChatsStore.filter((item) => item.id !== chat.id)].slice(0, 5);
    chatHistoryStore = [chat, ...chatHistoryStore.filter((item) => item.id !== chat.id)];
    return chat;
  },
};
