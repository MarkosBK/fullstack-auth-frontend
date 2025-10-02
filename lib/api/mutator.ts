import { apiClient } from './client';

// Адаптер для Orval - связывает сгенерированные типы с вашим axios клиентом
export const customInstance = async <T>(config: any): Promise<T> => {
  const { method, url, data, params } = config;

  console.log('🚀 API Request:', { method, url, data, params });

  let response;
  try {
    switch (method) {
      case 'GET':
        response = await apiClient.get(url, { params });
        break;
      case 'POST':
        response = await apiClient.post(url, data);
        break;
      case 'PUT':
        response = await apiClient.put(url, data);
        break;
      case 'PATCH':
        response = await apiClient.patch(url, data);
        break;
      case 'DELETE':
        response = await apiClient.delete(url);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    console.log('✅ API Response:', response);

    // Всегда возвращаем response как есть (без извлечения data)
    // Это означает, что сервер должен возвращать данные напрямую
    return response as T;
  } catch (error) {
    console.error('❌ API Error:', error);
    throw error;
  }
};

export default customInstance;
