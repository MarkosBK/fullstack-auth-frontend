import { TouchableOpacity, View } from 'react-native';
import ThemeToggle from '../../components/ThemeToggle';
import { HeadlineLarge, LabelLarge } from '../../components/typography';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { paths } from '@/lib/utils/paths';

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <HeadlineLarge className="mb-4 text-center">{t('home.welcome')}</HeadlineLarge>
      <ThemeToggle />

      <TouchableOpacity
        className="mt-4 rounded-full bg-primary p-4"
        onPress={() => router.push(paths.modals.selectLanguage())}>
        <LabelLarge>Modal</LabelLarge>
      </TouchableOpacity>
    </View>
  );
}
