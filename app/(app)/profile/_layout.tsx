import { routeGuard } from '@/lib/guards/routeGuard';
import { paths } from '@/lib/utils/paths';
import { useTheme } from '@/providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function ProfileLayout() {
  const { themeColors } = useTheme();
  const canAccessSettings = routeGuard({ routeConfig: paths.app.settings })();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: themeColors.background },
        headerTitleStyle: { color: themeColors.text },
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={themeColors.text} />
          </TouchableOpacity>
        ),
      }}>
      <Stack.Protected guard={canAccessSettings}>
        <Stack.Screen
          name="settings"
          options={{
            headerTitle: 'Settings',
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}
