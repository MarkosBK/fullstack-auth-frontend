import { ThemeToggle } from '@/components/theme-toggle';
import { View } from 'react-native';
import { HeadlineLarge } from '@/components/typography';

const NewsScreen = () => {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <HeadlineLarge className="mb-4">News screen</HeadlineLarge>
      <ThemeToggle />
    </View>
  );
};

export default NewsScreen;
