export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  isCode?: boolean;
  codeLanguage?: string;
}

export interface RecentChat {
  id: string;
  title: string;
  time: string;
  period?: 'today' | 'yesterday';
}
