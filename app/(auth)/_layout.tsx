import { routeGuard } from '@/lib/guards/routeGuard';
import { paths } from '@/lib/utils/paths';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  const canAccessLogin = routeGuard({ routeConfig: paths.auth.signIn })();
  const canAccessRegister = routeGuard({ routeConfig: paths.auth.signUp })();
  const canAccessResetPasswordRequest = routeGuard({
    routeConfig: paths.auth.resetPasswordRequest,
  })();
  const canAccessResetPasswordVerify = routeGuard({
    routeConfig: paths.auth.resetPasswordVerify,
  })();
  const canAccessResetPassword = routeGuard({ routeConfig: paths.auth.resetPassword })();

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
      <Stack.Protected guard={canAccessResetPasswordRequest}>
        <Stack.Screen name="reset-password-request" />
      </Stack.Protected>
      <Stack.Protected guard={canAccessResetPasswordVerify}>
        <Stack.Screen name="reset-password-verify" />
      </Stack.Protected>
      <Stack.Protected guard={canAccessResetPassword}>
        <Stack.Screen name="reset-password" />
      </Stack.Protected>
    </Stack>
  );
}
