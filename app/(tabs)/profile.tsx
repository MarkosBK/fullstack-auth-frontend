import { paths } from '@/lib/utils/paths';
import { router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { HeadlineLarge, LabelLarge } from '@/components/typography';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <HeadlineLarge className="mb-4">Profile screen</HeadlineLarge>
      <TouchableOpacity onPress={() => router.push(paths.settings())}>
        <LabelLarge>Settings</LabelLarge>
      </TouchableOpacity>
    </View>
  );
}
