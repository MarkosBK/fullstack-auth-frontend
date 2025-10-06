import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { paths, type RouteConfig } from '@/lib/utils/paths';

interface WithAuthOptions {
  routeConfig?: RouteConfig; // route config from paths.ts
  fallback?: React.ReactNode;
}

export function withRouteProtection<P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  return function AuthenticatedComponent(props: P) {
    const { isLoading, canAccessRoute } = useAuth();

    if (isLoading) {
      return options.fallback || <div>Загрузка...</div>;
    }

    if (options.routeConfig) {
      const hasAccess = canAccessRoute(options.routeConfig);
      if (!hasAccess) {
        return <Redirect href={options.routeConfig.redirectTo || paths.auth.login.path} />;
      }
      return <Component {...props} />;
    }

    return <Component {...props} />;
  };
}
