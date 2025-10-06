import { paths } from '@/lib/utils/paths';
import { useAuth } from '@/providers/AuthProvider';
import { Redirect } from 'expo-router';

export default function Index() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect href={paths.app.home.path} />;
  }

  return <Redirect href={paths.auth.login.path} />;
}
