import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { cn } from '@/lib/utils/cn';
import { BodyMedium, LabelSmall } from '@/components/typography';
import { useTheme } from '@/providers/ThemeProvider';
import { ApiError } from '@/lib/api/client';

interface ServerErrorProps {
  error: ApiError | null;
  onDismiss?: () => void;
  className?: string;
}

export const ServerError = React.memo(({ error, onDismiss, className }: ServerErrorProps) => {
  const { themeColors } = useTheme();

  if (!error) return null;

  // Извлекаем сообщение об ошибке
  const getErrorMessage = (): string => {
    if (!error.error?.message) return 'Произошла неизвестная ошибка';

    // Если сообщение - массив строк
    if (Array.isArray(error.error.message)) {
      return error.error.message.join(', ');
    }

    // Если сообщение - строка
    return error.error.message;
  };

  // Определяем тип ошибки по статусу
  const getErrorType = () => {
    switch (error.status) {
      case 400:
        return { icon: 'alert-circle', title: 'Validation error' };
      case 401:
        return { icon: 'lock', title: 'Authorization error' };
      case 403:
        return { icon: 'shield', title: 'Access denied' };
      case 404:
        return { icon: 'search', title: 'Not found' };
      case 409:
        return { icon: 'alert-triangle', title: 'Data conflict' };
      case 500:
        return { icon: 'server', title: 'Server error' };
      default:
        return { icon: 'alert-circle', title: 'Error' };
    }
  };

  const errorType = getErrorType();
  const errorMessage = getErrorMessage();

  return (
    <View
      className={cn(
        'mb-4 rounded-3xl border border-error-100/50 bg-error-500/5 p-4',
        className
      )}
 >
      <View className="mb-2 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Feather
            name={errorType.icon as any}
            size={20}
            color={themeColors['error-500']}
            className="mr-2"
          />
          <LabelSmall className="text-error-700 font-semibold">
            {errorType.title}
          </LabelSmall>
        </View>

        {onDismiss && (
          <TouchableOpacity
            onPress={onDismiss}
            className="h-6 w-6 items-center justify-center rounded-full bg-error-100">
            <Feather
              name="x"
              size={14}
              color={themeColors['error-600']}
            />
          </TouchableOpacity>
        )}
      </View>

      <BodyMedium className="text-error-600 leading-5">
        {errorMessage}
      </BodyMedium>
    </View>
  );
});

ServerError.displayName = 'ServerError';
