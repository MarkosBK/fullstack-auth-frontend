import { routeGuard } from '@/lib/guards/routeGuard';
import { paths } from '@/lib/utils/paths';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  const canAccessLogin = routeGuard({ routeConfig: paths.auth.signIn })();
  const canAccessRegister = routeGuard({ routeConfig: paths.auth.signUp })();
  const canAccessForgotPassword = routeGuard({ routeConfig: paths.auth.resetPasswordRequest })();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Protected guard={canAccessLogin}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
      <Stack.Protected guard={canAccessRegister}>
        <Stack.Screen name="sign-up" />
      </Stack.Protected>
      <Stack.Protected guard={canAccessForgotPassword}>
        <Stack.Screen name="reset-password-request" />
      </Stack.Protected>
    </Stack>
  );
}
