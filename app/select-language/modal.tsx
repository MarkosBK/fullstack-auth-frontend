import { Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/stores/theme.store';
import {
  useLanguage,
  AVAILABLE_LANGUAGES,
  LANGUAGE_NAMES,
  type Language,
} from '@/stores/language.store';
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Title, TitleMedium } from '@/components/typography';
import { AppHaptics } from '@/lib/utils/haptics';

const Modal = () => {
  const { themeColors } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  const handleLanguageSelect = async (languageId: Language) => {
    AppHaptics.selection();
    // TODO: remove setTimeout (smooth transition)
    setTimeout(() => {
      setLanguage(languageId);
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
        {AVAILABLE_LANGUAGES.map((langId, index) => {
          const langInfo = LANGUAGE_NAMES[langId];
          const isSelected = language === langId;

          return (
            <Pressable
              key={langId}
              className={`mb-3 rounded-2xl bg-background-500 p-4 ${
                index === AVAILABLE_LANGUAGES.length - 1 ? 'mb-0' : ''
              }`}
              onPress={() => handleLanguageSelect(langId)}>
              <View className="flex-row items-center">
                <View className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-primary-500/10">
                  <Text className="text-2xl">{langInfo.flag}</Text>
                </View>

                <View className="flex-1">
                  <Text
                    className="mb-1 text-lg font-semibold"
                    style={{ color: themeColors.primary }}>
                    {langInfo.nativeName}
                  </Text>
                  <Text className="text-sm" style={{ color: themeColors['text-600'] }}>
                    {t(`language.${langInfo.code}`)}
                  </Text>
                </View>

                {isSelected && (
                  <View className="ml-3">
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={themeColors['primary-500']}
                    />
                  </View>
                )}
                {!isSelected && (
                  <View className="ml-3">
                    <Ionicons name="chevron-forward" size={20} color={themeColors['primary-500']} />
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default Modal;
