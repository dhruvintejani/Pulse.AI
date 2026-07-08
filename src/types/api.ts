import type { ChatAttachment, MessageReaction, MessageRole } from '@/types/chat';
import type { NotificationPriority, NotificationType } from '@/types/notification';
import type { ProfileDetails } from '@/types/profile';

export type ISODateString = string;
export type EntityId = string;

export interface ApiHealthResponse {
  status: 'ok' | 'degraded' | 'down';
  service: string;
  version?: string;
  timestamp: ISODateString;
}

export interface ApiUser {
  id: EntityId;
  clerkId?: string;
  name: string;
  email: string;
  imageUrl?: string;
  company?: string;
  role?: string;
  location?: string;
  plan?: 'free' | 'pro' | 'team' | 'enterprise';
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface AuthSessionRequest {
  provider: 'clerk';
  token?: string | null;
}

export interface AuthSessionResponse {
  user: ApiUser;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: ISODateString;
}

export interface UpdateProfileRequest extends Partial<Pick<ProfileDetails, 'name' | 'email' | 'company' | 'role' | 'location' | 'biography' | 'timezone' | 'skills' | 'socials'>> {}

export interface ApiChatMessage {
  id: EntityId;
  conversationId: EntityId;
  role: MessageRole;
  content: string;
  createdAt: ISODateString;
  updatedAt?: ISODateString;
  isCode?: boolean;
  codeLanguage?: string;
  reaction?: MessageReaction;
  attachments?: ChatAttachment[];
}

export interface ApiConversation {
  id: EntityId;
  title: string;
  period?: 'today' | 'yesterday';
  pinned: boolean;
  favorite: boolean;
  model?: string;
  messages?: ApiChatMessage[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface ConversationListRequest {
  search?: string;
  pinned?: boolean;
  favorite?: boolean;
  page?: number;
  pageSize?: number;
}

export interface CreateConversationRequest {
  title?: string;
  initialMessage?: string;
  model?: string;
}

export interface RenameConversationRequest {
  title: string;
}

export interface SendMessageRequest {
  content: string;
  model?: string;
  attachments?: ChatAttachment[];
}

export interface MessageReactionRequest {
  reaction: MessageReaction;
}

export interface RegenerateMessageRequest {
  model?: string;
  instructions?: string;
}

export type ApiDocumentType = 'pdf' | 'doc' | 'docx' | 'txt' | 'md' | 'csv' | 'xlsx' | 'image' | 'other';

export interface ApiDocument {
  id: EntityId;
  name: string;
  type: ApiDocumentType;
  size: string;
  sizeBytes?: number;
  category: string;
  tags: string[];
  starred: boolean;
  analyzed: boolean;
  previewUrl?: string;
  downloadUrl?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface DocumentListRequest {
  search?: string;
  category?: string;
  tag?: string;
  type?: ApiDocumentType;
  starred?: boolean;
  sortBy?: 'name' | 'updatedAt' | 'size' | 'type';
  sortDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface DocumentUploadRequest {
  file: File;
  category?: string;
  tags?: string[];
}

export interface UpdateDocumentRequest {
  name?: string;
  category?: string;
  tags?: string[];
  starred?: boolean;
}

export interface ApiNotification {
  id: EntityId;
  type: NotificationType;
  category: string;
  priority: NotificationPriority;
  title: string;
  description: string;
  actionLabel?: string;
  actionUrl?: string;
  unread: boolean;
  createdAt: ISODateString;
}

export interface NotificationListRequest {
  search?: string;
  type?: NotificationType;
  unread?: boolean;
  priority?: NotificationPriority;
  page?: number;
  pageSize?: number;
}

export interface DashboardOverviewResponse {
  stats: Array<{ label: string; value: string; change?: string }>;
  recentChats: ApiConversation[];
  recentDocuments: ApiDocument[];
  recentNotifications: ApiNotification[];
}

export interface AnalyticsOverviewResponse {
  cards: Array<{ label: string; value: string; change: string }>;
  usage: Array<Record<string, string | number>>;
  models: Array<Record<string, string | number>>;
  workspaces: Array<Record<string, string | number>>;
}

export interface WorkspaceSummaryResponse {
  id: EntityId;
  name: string;
  members: number;
  documents: number;
  conversations: number;
  updatedAt: ISODateString;
}

export interface SettingsSectionRequest<TValue = Record<string, unknown>> {
  section: string;
  values: TValue;
}

export interface BillingPlan {
  id: EntityId;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
}

export interface BillingSubscriptionResponse {
  id: EntityId;
  plan: BillingPlan;
  status: 'active' | 'trialing' | 'past_due' | 'cancelled';
  renewsAt?: ISODateString;
}
