import { apiClient } from '@/services/api';
import type { UserSettingsPayload, UserSettingsResponse } from '@/types/settings';

const storageKey = 'pulse-user-settings-cache';

const fallbackSettings: UserSettingsResponse = {
  id: 'local-settings',
  user_id: 'local-user',
  theme: 'system',
  language: 'en',
  timezone: 'UTC',
  notification_preferences: { email: true, in_app: true, push: false },
  profile_settings: {},
  privacy_settings: { data_sharing: false },
  security_settings: { session_alerts: true, device_review: true },
  appearance_settings: { density: 'comfortable', animations: true, glass_effects: true },
  ai_preferences: {},
  metadata: {},
  recent_searches: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const readCache = () => {
  try {
    const value = window.localStorage.getItem(storageKey);
    return value ? { ...fallbackSettings, ...JSON.parse(value) } as UserSettingsResponse : fallbackSettings;
  } catch {
    return fallbackSettings;
  }
};

const writeCache = (settings: UserSettingsResponse) => {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(settings));
  } catch {
    return undefined;
  }
};

export const userSettingsService = {
  getSettings: async () => {
    try {
      const settings = await apiClient.get<UserSettingsResponse>('/settings/me');
      writeCache(settings);
      return settings;
    } catch {
      return readCache();
    }
  },

  updateSettings: async (payload: UserSettingsPayload) => {
    try {
      const settings = await apiClient.patch<UserSettingsResponse, UserSettingsPayload>('/settings/me', payload);
      writeCache(settings);
      return settings;
    } catch {
      const settings = { ...readCache(), ...payload, updated_at: new Date().toISOString() } as UserSettingsResponse;
      writeCache(settings);
      return settings;
    }
  },
};
