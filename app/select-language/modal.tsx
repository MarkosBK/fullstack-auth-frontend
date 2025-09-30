import { Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../providers/ThemeProvider';
import { changeLanguage } from '../../i18n';
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Title, TitleMedium } from '@/components/typography';
import * as Haptics from 'expo-haptics';

export default function Modal() {
  const { themeColors } = useTheme();
  const { t } = useTranslation();

  const languages = [
    {
      id: 'en-US',
      nativeName: 'English',
      flag: '🇺🇸',
      code: 'en',
    },
    {
      id: 'ru-RU',
      nativeName: 'Русский',
      flag: '🇷🇺',
      code: 'ru',
    },
  ];

  const handleLanguageSelect = async (languageId: string) => {
    Haptics.selectionAsync();
    // TODO: remove setTimeout (smooth transition)
    setTimeout(() => {
      changeLanguage(languageId);
    }, 100);
    router.back();
  };

  return (
    <View className="flex-1 p-5 pb-10">
      {/* Handle */}
      <View className="mb-5 h-1 w-10 self-center rounded-sm bg-text-700" />

      <Title className="mb-2 text-center text-text">{t('language.selectTitle')}</Title>
      <TitleMedium className="mb-6 text-center text-text-600">
        {t('language.selectSubtitle')}
      </TitleMedium>

      <View className="flex-1">
        {languages.map((language, index) => (
          <Pressable
            key={language.id}
            className={`mb-3 rounded-2xl bg-background-500 p-4 ${
              index === languages.length - 1 ? 'mb-0' : ''
            }`}
            onPress={() => handleLanguageSelect(language.id)}>
            <View className="flex-row items-center">
              <View className="bg-primary-500/10 mr-4 h-10 w-10 items-center justify-center rounded-full">
                <Text className="text-2xl">{language.flag}</Text>
              </View>

              <View className="flex-1">
                <Text className="mb-1 text-lg font-semibold" style={{ color: themeColors.primary }}>
                  {language.nativeName}
                </Text>
                <Text className="text-sm" style={{ color: themeColors['text-600'] }}>
                  {t(`language.${language.code}`)}
                </Text>
              </View>

              <View className="ml-3">
                <Ionicons name="chevron-forward" size={20} color={themeColors['primary-500']} />
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
