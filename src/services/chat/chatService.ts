import { DEFAULT_ASSISTANT_REPLY, INITIAL_CONVERSATIONS, REGENERATED_ASSISTANT_REPLY } from '@/constants/chat';
import type {
  ChatConversation,
  ChatMessage,
  ConversationMessagePayload,
  MessageReactionPayload,
  RecentChat,
  RenameConversationPayload,
} from '@/types/chat';

let conversationsStore: ChatConversation[] = [...INITIAL_CONVERSATIONS];
let activeConversationId = conversationsStore[0]?.id ?? '';

const sortConversations = (conversations: ChatConversation[]) => {
  return [...conversations].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (a.favorite !== b.favorite) return a.favorite ? -1 : 1;
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });
};

const toRecentChat = (conversation: ChatConversation): RecentChat => ({
  id: conversation.id,
  title: conversation.title,
  time: conversation.time,
  period: conversation.period,
  pinned: conversation.pinned,
  favorite: conversation.favorite,
});

const getActiveConversation = () => {
  return conversationsStore.find((conversation) => conversation.id === activeConversationId) ?? conversationsStore[0] ?? null;
};

const touchConversation = (conversationId: string) => {
  conversationsStore = conversationsStore.map((conversation) => (
    conversation.id === conversationId
      ? { ...conversation, time: 'now', period: 'today', updatedAt: new Date() }
      : conversation
  ));
};

export const chatService = {
  getConversations: async () => sortConversations(conversationsStore),
  searchConversations: async (search: string) => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return sortConversations(conversationsStore);
    return sortConversations(conversationsStore).filter((conversation) => (
      conversation.title.toLowerCase().includes(normalizedSearch) ||
      conversation.messages.some((message) => message.content.toLowerCase().includes(normalizedSearch))
    ));
  },
  getActiveConversation: async () => getActiveConversation(),
  getMessages: async () => getActiveConversation()?.messages ?? [],
  getRecentChats: async () => sortConversations(conversationsStore).slice(0, 5).map(toRecentChat),
  getChatHistory: async () => sortConversations(conversationsStore).map(toRecentChat),
  setActiveConversation: async (conversationId: string) => {
    activeConversationId = conversationId;
    return getActiveConversation();
  },
  createConversation: async () => {
    const conversation: ChatConversation = {
      id: Date.now().toString(),
      title: 'New conversation',
      time: 'now',
      period: 'today',
      messages: [
        {
          id: `${Date.now()}-welcome`,
          role: 'assistant',
          content: 'New conversation started. What would you like to work on?',
          timestamp: new Date(),
        },
      ],
      pinned: false,
      favorite: false,
      updatedAt: new Date(),
    };

    conversationsStore = [conversation, ...conversationsStore];
    activeConversationId = conversation.id;
    return conversation;
  },
  deleteConversation: async (conversationId: string) => {
    conversationsStore = conversationsStore.filter((conversation) => conversation.id !== conversationId);
    if (activeConversationId === conversationId) {
      activeConversationId = conversationsStore[0]?.id ?? '';
    }
    return getActiveConversation();
  },
  renameConversation: async ({ conversationId, title }: RenameConversationPayload) => {
    conversationsStore = conversationsStore.map((conversation) => (
      conversation.id === conversationId
        ? { ...conversation, title: title.trim() || conversation.title, updatedAt: new Date() }
        : conversation
    ));
    return conversationsStore.find((conversation) => conversation.id === conversationId) ?? null;
  },
  togglePinned: async (conversationId: string) => {
    conversationsStore = conversationsStore.map((conversation) => (
      conversation.id === conversationId
        ? { ...conversation, pinned: !conversation.pinned, updatedAt: new Date() }
        : conversation
    ));
    return conversationsStore.find((conversation) => conversation.id === conversationId) ?? null;
  },
  toggleFavorite: async (conversationId: string) => {
    conversationsStore = conversationsStore.map((conversation) => (
      conversation.id === conversationId
        ? { ...conversation, favorite: !conversation.favorite, updatedAt: new Date() }
        : conversation
    ));
    return conversationsStore.find((conversation) => conversation.id === conversationId) ?? null;
  },
  addMessage: async ({ conversationId, message }: ConversationMessagePayload) => {
    conversationsStore = conversationsStore.map((conversation) => (
      conversation.id === conversationId
        ? { ...conversation, messages: [...conversation.messages, message] }
        : conversation
    ));
    touchConversation(conversationId);
    return message;
  },
  addAssistantReply: async (conversationId: string) => {
    const message: ChatMessage = {
      id: `${Date.now()}-assistant`,
      role: 'assistant',
      content: DEFAULT_ASSISTANT_REPLY,
      timestamp: new Date(),
    };

    await chatService.addMessage({ conversationId, message });
    return message;
  },
  regenerateLastAssistantMessage: async (conversationId: string) => {
    const message: ChatMessage = {
      id: `${Date.now()}-regen`,
      role: 'assistant',
      content: REGENERATED_ASSISTANT_REPLY,
      timestamp: new Date(),
    };

    conversationsStore = conversationsStore.map((conversation) => {
      if (conversation.id !== conversationId) return conversation;
      const messages = [...conversation.messages];
      const lastAssistantIndex = [...messages].reverse().findIndex((item) => item.role === 'assistant');
      if (lastAssistantIndex >= 0) {
        const targetIndex = messages.length - 1 - lastAssistantIndex;
        messages[targetIndex] = message;
        return { ...conversation, messages };
      }
      return { ...conversation, messages: [...messages, message] };
    });
    touchConversation(conversationId);
    return message;
  },
  updateMessageReaction: async ({ conversationId, messageId, reaction }: MessageReactionPayload) => {
    conversationsStore = conversationsStore.map((conversation) => {
      if (conversation.id !== conversationId) return conversation;

      return {
        ...conversation,
        messages: conversation.messages.map((message) => (
          message.id === messageId ? { ...message, reaction } : message
        )),
      };
    });

    return conversationsStore
      .find((conversation) => conversation.id === conversationId)
      ?.messages.find((message) => message.id === messageId) ?? null;
  },
};
