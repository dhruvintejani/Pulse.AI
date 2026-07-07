export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  reactions?: string[];
  isCode?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  model: string;
  pinned?: boolean;
  tags?: string[];
}

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'txt' | 'md' | 'csv';
  size: string;
  updatedAt: Date;
  tags?: string[];
  starred?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'enterprise';
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}
