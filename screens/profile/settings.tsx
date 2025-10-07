import { View } from 'react-native';
import { ThemeToggle } from '@/components/theme-toggle';
import { HeadlineLarge } from '@/components/typography';

const SettingsScreen = () => {
  return (
    <View className="flex-1 items-center justify-center bg-yellow-500">
      <HeadlineLarge className="mb-4">Settings screen</HeadlineLarge>
      <ThemeToggle />
    </View>
  );
};

export default SettingsScreen;
