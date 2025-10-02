// Standard error interface
interface StandardError {
  message: string;
  code?: string;
  status?: number;
  timestamp?: string;
  path?: string;
  method?: string;
}

/**
 * Извлекает сообщение об ошибке из любого типа ошибки
 * @param error - Любой тип ошибки
 * @returns Строка с сообщением об ошибке
 */
export function getErrorMessage(error: any): string {
  // 1. ApiError из handleError (наш кастомный формат)
  if (error?.error?.message) {
    return error.error.message;
  }

  // 2. Прямая Axios ошибка с сервера
  if (error?.response?.data?.error?.message) {
    return error.response.data.error.message;
  }

  // 3. Простая ошибка с сервера
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  // 4. Обычная JavaScript Error
  if (error?.message) {
    return error.message;
  }

  // 5. Строка
  if (typeof error === 'string') {
    return error;
  }

  // 6. Fallback
  return 'Something went wrong';
}

/**
 * Извлекает код ошибки
 * @param error - Любой тип ошибки
 * @returns Код ошибки или undefined
 */
export function getErrorCode(error: any): string | undefined {
  return error?.error?.code || error?.response?.data?.error?.code || error?.code || undefined;
}

/**
 * Извлекает HTTP статус код
 * @param error - Любой тип ошибки
 * @returns HTTP статус или undefined
 */
export function getErrorStatus(error: any): number | undefined {
  return error?.response?.status || error?.error?.status || error?.status || undefined;
}

/**
 * Преобразует любую ошибку в стандартизированный формат
 * @param error - Любой тип ошибки
 * @returns Стандартизированная ошибка
 */
export function normalizeError(error: any): StandardError {
  return {
    message: getErrorMessage(error),
    code: getErrorCode(error),
    status: getErrorStatus(error),
    timestamp: error?.error?.timestamp || new Date().toISOString(),
    path: error?.error?.path || error?.request?.config?.url || '',
    method: error?.error?.method || error?.request?.config?.method || '',
  };
}
