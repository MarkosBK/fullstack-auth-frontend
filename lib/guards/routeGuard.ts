import { useAuth } from '@/providers/AuthProvider';
import { type RouteConfig } from '@/lib/utils/paths';

// Guard функция для Stack.Protected с полной логикой проверки доступа
export const routeGuard = (options: { routeConfig: RouteConfig }) => {
  return () => {
    const { isLoading, canAccessRoute } = useAuth();

    if (isLoading) {
      return false;
    }

    // Проверяем доступ по конфигурации маршрута
    if (options.routeConfig) {
      return canAccessRoute(options.routeConfig);
    }

    // Если нет конфигурации, разрешаем доступ
    return true;
  };
};
