export type MessageRole = 'user' | 'assistant';
export type ConversationPeriod = 'today' | 'yesterday';
export type MessageReaction = 'like' | 'dislike' | null;
export type ChatAttachmentType = 'image' | 'file';

export interface ChatAttachment {
  id: string;
  name: string;
  size: string;
  type: ChatAttachmentType;
  mimeType: string;
  previewUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  isCode?: boolean;
  codeLanguage?: string;
  reaction?: MessageReaction;
  attachments?: ChatAttachment[];
}

export interface ChatConversation {
  id: string;
  title: string;
  time: string;
  period: ConversationPeriod;
  messages: ChatMessage[];
  pinned: boolean;
  favorite: boolean;
  updatedAt: Date;
}

export type RecentChat = Pick<ChatConversation, 'id' | 'title' | 'time' | 'period' | 'pinned' | 'favorite'>;

export interface RenameConversationPayload {
  conversationId: string;
  title: string;
}

export interface ConversationMessagePayload {
  conversationId: string;
  message: ChatMessage;
}

export interface MessageReactionPayload {
  conversationId: string;
  messageId: string;
  reaction: MessageReaction;
}
