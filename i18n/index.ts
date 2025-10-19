import i18n, { use as i18nUse, changeLanguage as i18nChangeLanguage } from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { languageStorage } from '@/lib/utils/storage';
import translationEn from './locales/en-US/translations.json';
import translationDe from './locales/de-DE/translations.json';

const resources = {
  'en-US': { translation: translationEn },
  en: { translation: translationEn },
  'de-DE': { translation: translationDe },
  de: { translation: translationDe },
};

const initI18n = async () => {
  try {
    // Try to get saved language preference
    const savedLanguage = await languageStorage.getLanguage();

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

    // Save the selected language
    if (!savedLanguage) {
      await languageStorage.setLanguage(selectedLanguage);
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
    await languageStorage.setLanguage(language);
  } catch (error) {
    console.error('Error changing language:', error);
  }
};

export default i18n;
