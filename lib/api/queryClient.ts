import { QueryClient } from '@tanstack/react-query';

// Конфигурация QueryClient с лучшими практиками
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Время кэширования данных (5 минут)
      staleTime: 5 * 60 * 1000,
      // Время жизни кэша (10 минут)
      gcTime: 10 * 60 * 1000,
      // Повторные попытки при ошибке
      retry: (failureCount, error: any) => {
        // Не повторяем для ошибок 4xx (кроме 408, 429)
        if (error?.status >= 400 && error?.status < 500) {
          if (error?.status === 408 || error?.status === 429) {
            return failureCount < 3;
          }
          return false; // Не повторяем для 401, 403, 404 и т.д.
        }
        // Повторяем до 3 раз для других ошибок (5xx, сетевые)
        return failureCount < 3;
      },
      // Интервал между повторными попытками
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Рефетч при фокусе окна
      refetchOnWindowFocus: false,
      // Рефетч при восстановлении соединения
      refetchOnReconnect: true,
    },
    mutations: {
      // Мутации не повторяем автоматически - слишком опасно
      retry: false,
    },
  },
});
