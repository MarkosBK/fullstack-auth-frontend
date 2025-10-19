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
 * Extracts error message from any error type
 * @param error - Any error type
 * @returns String with error message
 */
export function getErrorMessage(error: any): string {
  // 1. ApiError from handleError (our custom format)
  if (error?.error?.message) {
    return error.error.message;
  }

  // 2. Axios error from server
  if (error?.response?.data?.error?.message) {
    return error.response.data.error.message;
  }

  // 3. Simple error from server
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  // 4. Regular JavaScript Error
  if (error?.message) {
    return error.message;
  }

  // 5. String
  if (typeof error === 'string') {
    return error;
  }

  // 6. Fallback
  return 'Something went wrong';
}

/**
 * Extracts error code
 * @param error - Any error type
 * @returns Error code or undefined
 */
export function getErrorCode(error: any): string | undefined {
  return error?.error?.code || error?.response?.data?.error?.code || error?.code || undefined;
}

/**
 * Extracts HTTP status code
 * @param error - Any error type
 * @returns HTTP status or undefined
 */
export function getErrorStatus(error: any): number | undefined {
  return error?.response?.status || error?.error?.status || error?.status || undefined;
}

/**
 * Converts any error to standardized format
 * @param error - Any error type
 * @returns Standardized error
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
