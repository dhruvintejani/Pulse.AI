export type UserThemeMode = 'light' | 'dark' | 'system';

export interface UserSettingsPayload {
  theme?: UserThemeMode;
  language?: string;
  timezone?: string;
  notification_preferences?: Record<string, unknown>;
  profile_settings?: Record<string, unknown>;
  privacy_settings?: Record<string, unknown>;
  security_settings?: Record<string, unknown>;
  appearance_settings?: Record<string, unknown>;
  ai_preferences?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface UserSettingsResponse {
  id: string;
  user_id: string;
  theme: UserThemeMode;
  language: string;
  timezone: string;
  notification_preferences: Record<string, unknown>;
  profile_settings: Record<string, unknown>;
  privacy_settings: Record<string, unknown>;
  security_settings: Record<string, unknown>;
  appearance_settings: Record<string, unknown>;
  ai_preferences: Record<string, unknown>;
  metadata: Record<string, unknown>;
  recent_searches: string[];
  created_at: string;
  updated_at: string;
}
