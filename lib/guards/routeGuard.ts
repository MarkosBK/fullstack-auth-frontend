import { useAuth } from '@/providers/AuthProvider';
import { type RouteConfig } from '@/lib/utils/paths';

// Guard function for Stack.Protected with full access check logic
export const routeGuard = (options: { routeConfig: RouteConfig }) => {
  return () => {
    const { isLoading, canAccessRoute } = useAuth();

    // if (isLoading) {
    //   return false;
    // }

    // Check access by route configuration
    if (options.routeConfig) {
      return canAccessRoute(options.routeConfig);
    }

    // If no configuration, allow access
    return true;
  };
};
