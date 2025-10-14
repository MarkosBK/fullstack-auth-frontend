import { Href } from 'expo-router';
import { RoleName, type UserDataSchema } from '@/lib/api/generated/schemas';

// Типы для конфигурации маршрутов
export interface RouteConfig {
  path: string | Href;
  auth: boolean;
  roles?: RoleName[];
  permissions?: string[];
  customCheck?: (user: UserDataSchema | null, params?: any) => boolean;
  redirectTo?: string | Href;
}

export const paths = {
  // Auth routes
  auth: {
    signIn: {
      path: '/(auth)/sign-in' as Href,
      auth: false,
      redirectTo: '/(app)/(tabs)/index',
    },
    signUp: {
      path: '/(auth)/sign-up' as Href,
      auth: false,
      redirectTo: '/(app)/(tabs)/index',
    },
    resetPasswordRequest: {
      path: '/(auth)/reset-password-request' as Href,
      auth: false,
      redirectTo: '/(app)/(tabs)/index',
    },
    signUpVerify: {
      path: '/(auth)/sign-up-verify' as Href,
      auth: false,
      redirectTo: '/(app)/(tabs)/index',
    },
  },

  // App routes
  app: {
    home: {
      path: '/(app)/(tabs)' as Href,
      auth: true,
    },
    profile: {
      path: '/(app)/(tabs)/profile' as Href,
      auth: true,
    },
    settings: {
      path: '/(app)/profile/settings' as Href,
      auth: true,
    },
    news: {
      path: '/(app)/(tabs)/news' as Href,
      auth: true,
    },
    search: {
      path: '/(app)/(tabs)/search' as Href,
      auth: true,
      roles: [RoleName.CUSTOMER] as RoleName[],
      redirectTo: '/(app)/(tabs)',
    },
  },

  // Modals
  modals: {
    selectLanguage: {
      path: '/select-language/modal' as Href,
      auth: false,
    },
  },
} as const;
