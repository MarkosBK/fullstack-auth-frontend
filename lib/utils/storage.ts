import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TEMP_DATA: '@auth_temp_data',
  TOKEN: '@access_token',
  REFRESH_TOKEN: '@refresh_token',
  THEME: '@app_theme',
  LANGUAGE: '@app_language',
  SIGNUP_RESEND_TIMER: '@signup_resend_timer',
  RESET_PASSWORD_RESEND_TIMER: '@reset_password_resend_timer',
} as const;

export type StorageKeys = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

// Types
export type RegistrationUser = {
  email: string;
  displayName: string;
};

export type ResetPasswordUser = {
  email: string;
  resetToken?: string;
};

export type TimerData = {
  expiresAt: number;
  durationSeconds: number;
};

// Token storage methods
export const tokenStorage = {
  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.TOKEN, accessToken],
      [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
    ]);
  },

  async getAccessToken(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  async getRefreshToken(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  async clearTokens(): Promise<void> {
    await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.REFRESH_TOKEN]);
  },
};

// Timer storage methods
export const timerStorage = {
  async setTimer(
    key: typeof STORAGE_KEYS.SIGNUP_RESEND_TIMER | typeof STORAGE_KEYS.RESET_PASSWORD_RESEND_TIMER,
    data: TimerData
  ): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  },

  async getTimer(
    key: typeof STORAGE_KEYS.SIGNUP_RESEND_TIMER | typeof STORAGE_KEYS.RESET_PASSWORD_RESEND_TIMER
  ): Promise<TimerData | null> {
    try {
      const savedState = await AsyncStorage.getItem(key);
      if (savedState) {
        return JSON.parse(savedState);
      }
      return null;
    } catch (error) {
      console.error('Error parsing timer state:', error);
      return null;
    }
  },

  async clearTimer(
    key: typeof STORAGE_KEYS.SIGNUP_RESEND_TIMER | typeof STORAGE_KEYS.RESET_PASSWORD_RESEND_TIMER
  ): Promise<void> {
    await AsyncStorage.removeItem(key);
  },

  async clearAllTimers(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.SIGNUP_RESEND_TIMER,
      STORAGE_KEYS.RESET_PASSWORD_RESEND_TIMER,
    ]);
  },
};

// Generic storage methods
export const storage = {
  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  },

  async getItem(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  },

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },

  async multiSet(keyValuePairs: [string, string][]): Promise<void> {
    await AsyncStorage.multiSet(keyValuePairs);
  },

  async multiRemove(keys: string[]): Promise<void> {
    await AsyncStorage.multiRemove(keys);
  },

  async clear(): Promise<void> {
    await AsyncStorage.clear();
  },
};
