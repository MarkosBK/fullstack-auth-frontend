# API Integration Guide (Orval + TanStack Query)

## Настройка

1. Создайте файл `.env` в корне проекта:

```env
EXPO_PUBLIC_API_URL=http://localhost:4000
EXPO_PUBLIC_ENV=development
```

2. Убедитесь, что все зависимости установлены:

```bash
npm install
```

## Автогенерация типов и хуков

### Генерация API типов и хуков

```bash
# Одноразовая генерация
npm run generate:api

# Автоматическое обновление при изменениях в API
npm run generate:api:watch
```

### Что генерируется:

- **Типы** - все DTO и интерфейсы из Swagger
- **Хуки** - готовые хуки для TanStack Query
- **Клиент** - типизированные функции для API вызовов

## Использование

### Базовое использование хуков

```tsx
import { useAuthControllerLogin, useUserControllerGetProfile } from '@/lib/hooks';

function LoginScreen() {
  const { data: user } = useUserControllerGetProfile();
  const loginMutation = useAuthControllerLogin();

  // Ваш код...
}
```

### Аутентификация

```tsx
const loginMutation = useAuthControllerLogin();
const registerMutation = useAuthControllerRegister();
const logoutMutation = useAuthControllerLogout();

// Вход
loginMutation.mutate({
  email: 'user@example.com',
  password: 'password',
});

// Регистрация
registerMutation.mutate({
  email: 'user@example.com',
  password: 'password',
  displayName: 'User Name',
});

// Выход
logoutMutation.mutate();
```

### Работа с профилем

```tsx
const { data: profile, isLoading } = useUserControllerGetProfile();
const updateProfileMutation = useUserControllerUpdateProfile();

// Обновление профиля
updateProfileMutation.mutate({
  displayName: 'New Name',
});
```

## Особенности

- **Автоматическая синхронизация** - типы всегда соответствуют API
- **Типобезопасность** - полная типизация TypeScript
- **Готовые хуки** - не нужно писать useQuery/useMutation
- **Автообновление** - следит за изменениями в Swagger
- **Кэширование** - TanStack Query обеспечивает умное кэширование
- **Обработка ошибок** - централизованная обработка через axios клиент

## Структура файлов

```
lib/
├── api/
│   ├── client.ts          # Axios клиент с токенами
│   ├── mutator.ts         # Адаптер для Orval
│   └── generated/         # Сгенерированные файлы
│       └── authAPI.ts     # Типы и хуки
├── hooks/
│   └── index.ts           # Экспорт всех хуков
└── orval.config.ts        # Конфигурация Orval
```

## Workflow

1. **Разработчик** меняет API в NestJS
2. **Swagger** автоматически обновляется
3. **Orval** сканирует изменения (`npm run generate:api:watch`)
4. **Типы и хуки** генерируются автоматически
5. **TypeScript** показывает ошибки если что-то не совпадает

## Лучшие практики

1. **Используйте сгенерированные хуки** вместо ручных useQuery
2. **Запускайте watch режим** во время разработки
3. **Коммитьте сгенерированные файлы** в git
4. **Используйте типы** из generated файлов
5. **Настройте CI** для проверки синхронизации типов
