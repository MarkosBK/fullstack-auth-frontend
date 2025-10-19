import { Stack } from 'expo-router';
import { ThemeProvider, useTheme } from '../providers/ThemeProvider';
import { ApiProvider } from '../providers/ApiProvider';
import '../styles/global.css';
import '@/i18n';
import { AuthProvider, useAuth } from '@/providers/AuthProvider';
import { paths } from '@/lib/utils/paths';
import { routeGuard } from '@/lib/guards/routeGuard';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { StatusBarBlured } from '@/components/common';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

SplashScreen.preventAutoHideAsync();

const StackWithTheme = () => {
  const { themeColors, isDark } = useTheme();
  const { isAuthenticated } = useAuth();
  const canAccessSelectLanguage = routeGuard({ routeConfig: paths.modals.selectLanguage })();

  useEffect(() => {
    async function prepare() {
      try {
        // Here you can perform preliminary data loading
        // For example: loading fonts, initializing API, checking authentication
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Minimum delay
      } catch (e) {
        console.warn('Error preparing application:', e);
      } finally {
        // Hide splash screen after preparation is complete
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  return (
    <>
      <StatusBarBlured />
      <Stack>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={canAccessSelectLanguage}>
          <Stack.Screen
            name="select-language/modal"
            options={{
              presentation: 'formSheet',
              animation: 'slide_from_bottom',
              headerShown: false,
              sheetAllowedDetents: 'fitToContents',
              sheetCornerRadius: 20,
              contentStyle: {
                backgroundColor: isDark
                  ? themeColors['background-300']
                  : themeColors['background-600'],
              },
            }}
          />
        </Stack.Protected>
      </Stack>
    </>
  );
};

export default function RootLayout() {
  return (
    <ApiProvider>
      <AuthProvider>
        <ThemeProvider>
          <KeyboardProvider>
            <StackWithTheme />
          </KeyboardProvider>
        </ThemeProvider>
      </AuthProvider>
    </ApiProvider>
  );
}
