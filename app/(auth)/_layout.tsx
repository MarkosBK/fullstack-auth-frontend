import { routeGuard } from '@/lib/guards/routeGuard';
import { paths } from '@/lib/utils/paths';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  const canAccessLogin = routeGuard({ routeConfig: paths.auth.login })();
  const canAccessRegister = routeGuard({ routeConfig: paths.auth.register })();
  const canAccessForgotPassword = routeGuard({ routeConfig: paths.auth.forgotPassword })();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Protected guard={canAccessLogin}>
        <Stack.Screen name="login" />
      </Stack.Protected>
      <Stack.Protected guard={canAccessRegister}>
        <Stack.Screen name="register" />
      </Stack.Protected>
      <Stack.Protected guard={canAccessForgotPassword}>
        <Stack.Screen name="forgot-password" />
      </Stack.Protected>
    </Stack>
  );
}
