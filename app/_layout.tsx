import { router, Stack } from 'expo-router';
import { ThemeProvider, useTheme } from '../providers/ThemeProvider';
import { ApiProvider } from '../providers/ApiProvider';
import '../styles/global.css';
import '@/i18n';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';

const StackWithTheme = () => {
  const { themeColors, isDark } = useTheme();

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
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          headerTitle: 'Theme Toggle',
        }}
      />

      <Stack.Screen
        name="select-language/modal"
        options={{
          presentation: 'formSheet',
          animation: 'slide_from_bottom',
          headerShown: false,
          sheetAllowedDetents: 'fitToContents', /// [0.5]
          sheetCornerRadius: 20,
          contentStyle: {
            backgroundColor: isDark ? themeColors['background-300'] : themeColors['background-600'],
          },
        }}
      />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <ApiProvider>
      <ThemeProvider>
        <StackWithTheme />
      </ThemeProvider>
    </ApiProvider>
  );
}
