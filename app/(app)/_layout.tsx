import { Stack } from 'expo-router';
import { routeGuard } from '@/lib/guards/routeGuard';
import { paths } from '@/lib/utils/paths';

export default function AppLayout() {
  const canAccessProfile = routeGuard({ routeConfig: paths.app.profile })();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="(tabs)" />

      <Stack.Protected guard={canAccessProfile}>
        <Stack.Screen name="profile" />
      </Stack.Protected>
    </Stack>
  );
}
