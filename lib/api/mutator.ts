import { apiClient } from './client';
import { router } from 'expo-router';
import { paths } from '@/lib/utils/paths';

// Orval adapter - connects generated types with your axios client
export const customInstance = async <T>(config: any): Promise<T> => {
  const { method, url, data, params } = config;

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

    return response as T;
  } catch (error: any) {
    console.error('❌ API Error:', error);

    if (error.status === 401) {
      const isAuthEndpoint = url?.includes('/auth/');

      if (!isAuthEndpoint) {
        await apiClient.logout();
        router.replace(paths.auth.signIn.path);
      }
    }

    throw error;
  }
};

export default customInstance;
