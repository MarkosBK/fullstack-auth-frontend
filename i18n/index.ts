import i18n, { use as i18nUse, changeLanguage as i18nChangeLanguage } from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import translationEn from './locales/en-US/translations.json';
import translationRu from './locales/ru-RU/translations.json';

const resources = {
  'en-US': { translation: translationEn },
  en: { translation: translationEn },
  'ru-RU': { translation: translationRu },
  ru: { translation: translationRu },
};

const LANGUAGE_KEY = '@app_language';

const initI18n = async () => {
  try {
    // Try to get saved language preference
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);

    // Determine which language to use
    let selectedLanguage = savedLanguage;

    if (!selectedLanguage) {
      // If no saved language, use device locale or fallback
      const deviceLocales = Localization.getLocales();
      const deviceLocale = deviceLocales[0]?.languageTag || 'en-US';
      const languageCode = deviceLocale.split('-')[0];
      // Try exact locale match first
      if (deviceLocale in resources) {
        selectedLanguage = deviceLocale;
      }

      // Then try language code match
      else if (languageCode in resources) {
        selectedLanguage = languageCode;
      } else {
        selectedLanguage = 'en-US';
      }
    }

    await i18nUse(initReactI18next).init({
      resources,
      lng: selectedLanguage,
      fallbackLng: {
        'en-*': ['en-US', 'en'],
        'ru-*': ['ru-RU', 'ru'],
        default: ['en-US'],
      },
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });

    // Save the selected language
    if (!savedLanguage) {
      await AsyncStorage.setItem(LANGUAGE_KEY, selectedLanguage);
    }
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

// Function to change language and save to storage
export const changeLanguage = async (language: string) => {
  try {
    await i18nChangeLanguage(language);
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.error('Error changing language:', error);
  }
};

export default i18n;
