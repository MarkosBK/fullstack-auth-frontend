import { View } from 'react-native';
import ThemeToggle from '../../components/ThemeToggle';
import { HeadlineLarge } from '../../components/typography';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-yellow-500">
      <HeadlineLarge className="mb-4">Settings screen</HeadlineLarge>
      <ThemeToggle />
    </View>
  );
}
