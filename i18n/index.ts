import i18n, { use as i18nUse } from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import translationEn from './locales/en-US/translations.json';
import translationDe from './locales/de-DE/translations.json';
import { languageStore } from '@/stores/language.store';
import { STORAGE_KEYS } from '@/lib/utils/storage';
import type { Language } from '@/stores/language.store';

const resources = {
  'en-US': { translation: translationEn },
  en: { translation: translationEn },
  'de-DE': { translation: translationDe },
  de: { translation: translationDe },
};

const initI18n = async () => {
  try {
    // get from zustand store
    let selectedLanguage: Language | null = languageStore.getState().language;

    if (!selectedLanguage) {
      // get from async storage
      try {
        const rawData = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
        if (rawData) {
          const parsed = JSON.parse(rawData);
          selectedLanguage = parsed?.state?.language || parsed?.language || null;
        }
      } catch {}
    }

    if (!selectedLanguage) {
      // get from device locale
      const deviceLocales = Localization.getLocales();
      const deviceLocale = deviceLocales[0]?.languageTag || 'en-US';
      const languageCode = deviceLocale.split('-')[0];

      if (deviceLocale in resources) {
        selectedLanguage = deviceLocale as Language;
      } else if (languageCode in resources) {
        selectedLanguage = languageCode === 'en' ? 'en-US' : 'de-DE';
      } else {
        selectedLanguage = 'en-US';
      }
    }

    // set to zustand store
    if (languageStore.getState().language !== selectedLanguage) {
      languageStore.setState({ language: selectedLanguage });
    }

    await i18nUse(initReactI18next).init({
      resources,
      lng: selectedLanguage,
      fallbackLng: {
        'en-*': ['en-US', 'en'],
        'de-*': ['de-DE', 'de'],
        default: ['en-US'],
      },
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
  } catch (error) {
    console.error('Error initializing i18n:', error);

    // Initialize with defaults if there's an error
    await i18nUse(initReactI18next).init({
      resources,
      lng: 'en-US',
      fallbackLng: 'en-US',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
  }
};

initI18n();

// Re-export changeLanguage from store for backward compatibility
export const changeLanguage = async (language: Language) => {
  await languageStore.getState().setLanguage(language);
};

export default i18n;
