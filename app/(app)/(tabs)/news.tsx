import ThemeToggle from '@/components/ThemeToggle';
import { View } from 'react-native';
import { HeadlineLarge } from '@/components/typography';
import { LoginForm } from '@/components/LoginForm';

const NewsScreen = () => {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <HeadlineLarge className="mb-4">News screen</HeadlineLarge>
      <ThemeToggle />
      <LoginForm />
    </View>
  );
};

export default NewsScreen;
