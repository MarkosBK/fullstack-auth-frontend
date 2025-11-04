import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n, { changeLanguage as i18nChangeLanguage } from 'i18next';
import { STORAGE_KEYS } from '@/lib/utils/storage';

export type Language = 'en-US' | 'de-DE';

export const AVAILABLE_LANGUAGES: Language[] = ['en-US', 'de-DE'];

export const LANGUAGE_NAMES: Record<Language, { nativeName: string; code: string; flag: string }> =
  {
    'en-US': {
      nativeName: 'English',
      code: 'en',
      flag: '🇺🇸',
    },
    'de-DE': {
      nativeName: 'Deutsch',
      code: 'de',
      flag: '🇩🇪',
    },
  };

interface LanguageStoreState {
  language: Language | null;
}

interface LanguageStoreActions {
  setLanguage: (language: Language) => Promise<void>;
}

type LanguageStore = LanguageStoreState & LanguageStoreActions;

export const languageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: null,

      setLanguage: async (language: Language) => {
        try {
          set({ language });
          await i18nChangeLanguage(language);
        } catch (error) {
          console.error('Error changing language:', error);
          throw error;
        }
      },
    }),
    {
      name: STORAGE_KEYS.LANGUAGE,
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error('Language rehydration error:', error);
          } else if (state?.language) {
            const language = state.language;
            console.log(language, 'language');

            const syncLanguage = () => {
              if (i18n.language !== language) {
                i18nChangeLanguage(language).catch((err) => {
                  console.error('Error syncing language with i18next:', err);
                });
              }
              // Отписываемся от события после синхронизации
              i18n.off('initialized', syncLanguage);
            };

            if (i18n.isInitialized) {
              syncLanguage();
            } else {
              i18n.on('initialized', syncLanguage);
            }
          }
        };
      },
    }
  )
);

// Hook for using language
export const useLanguage = () => {
  const language = languageStore((state) => state.language);
  const setLanguage = languageStore((state) => state.setLanguage);
  const hasHydrated = languageStore.persist.hasHydrated();

  const currentLanguage = language || 'en-US';

  return {
    language: currentLanguage as Language,
    setLanguage,
    isLoading: !hasHydrated,
  };
};
