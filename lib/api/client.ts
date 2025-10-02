import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  BaseSuccessResponseSchema,
  ApiErrorSchema,
  ValidationErrorSchema,
  NotFoundErrorSchema,
  ConflictErrorSchema,
} from './generated/schemas';

// Конфигурация API
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.100:4000';

// Токены для аутентификации
const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Типы ошибок (используем сгенерированные Orval)
type ApiError = ValidationErrorSchema | ApiErrorSchema | NotFoundErrorSchema | ConflictErrorSchema;

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: {
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }[] = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('🌐 API Client initialized with baseURL:', API_BASE_URL);
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor для добавления токена
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        console.log('token', token);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor для обработки ошибок и обновления токенов
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          // console.log('401 error', error);
          // Не пытаемся обновить токен для эндпоинтов логина/регистрации
          const isAuthEndpoint =
            originalRequest.url?.includes('/auth/login') ||
            originalRequest.url?.includes('/auth/register') ||
            originalRequest.url?.includes('/auth/forgot-password') ||
            originalRequest.url?.includes('/auth/reset-password');
          // console.log('isAuthEndpoint', isAuthEndpoint);
          if (isAuthEndpoint) {
            return Promise.reject(this.handleError(error));
          }

          if (this.isRefreshing) {
            // Если уже обновляем токен, добавляем запрос в очередь
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.client(originalRequest);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
            if (refreshToken) {
              const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                refreshToken,
              });

              const { token, refreshToken: newRefreshToken } = response.data.data;
              await AsyncStorage.setItem(TOKEN_KEY, token);
              await AsyncStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);

              this.processQueue(null, token);
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            await this.logout();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private processQueue(error: any, token: string | null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    this.failedQueue = [];
  }

  private handleError(error: any): ApiError {
    if (error.response) {
      // Сервер ответил с ошибкой
      const errorData = error.response.data as ApiErrorSchema;

      if (errorData?.error) {
        // Используем сгенерированный формат ошибок
        return errorData;
      } else {
        // Fallback для других форматов
        return {
          success: false,
          error: {
            message: error.response.data?.message || 'Произошла ошибка сервера',
            timestamp: new Date().toISOString(),
            path: error.request?.config?.url || '',
            method: error.request?.config?.method || '',
          },
        };
      }
    } else if (error.request) {
      // Запрос был отправлен, но ответа не получено
      return {
        success: false,
        error: {
          message: 'Нет соединения с сервером',
          timestamp: new Date().toISOString(),
          path: error.request?.config?.url || '',
          method: error.request?.config?.method || '',
        },
      };
    } else {
      // Что-то пошло не так при настройке запроса
      return {
        success: false,
        error: {
          message: error.message || 'Неизвестная ошибка',
          timestamp: new Date().toISOString(),
          path: error.request?.config?.url || '',
          method: error.request?.config?.method || '',
        },
      };
    }
  }

  // Методы для работы с токенами
  async setTokens(token: string, refreshToken: string) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(TOKEN_KEY);
  }

  async logout() {
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
  }

  // Базовые HTTP методы (используем сгенерированные типы)
  async get(url: string, config?: AxiosRequestConfig): Promise<BaseSuccessResponseSchema> {
    const response: AxiosResponse<BaseSuccessResponseSchema> = await this.client.get(url, config);
    return response.data;
  }

  async post(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<BaseSuccessResponseSchema> {
    const response: AxiosResponse<BaseSuccessResponseSchema> = await this.client.post(
      url,
      data,
      config
    );
    return response.data;
  }

  async put(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<BaseSuccessResponseSchema> {
    const response: AxiosResponse<BaseSuccessResponseSchema> = await this.client.put(
      url,
      data,
      config
    );
    return response.data;
  }

  async patch(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<BaseSuccessResponseSchema> {
    const response: AxiosResponse<BaseSuccessResponseSchema> = await this.client.patch(
      url,
      data,
      config
    );
    return response.data;
  }

  async delete(url: string, config?: AxiosRequestConfig): Promise<BaseSuccessResponseSchema> {
    const response: AxiosResponse<BaseSuccessResponseSchema> = await this.client.delete(
      url,
      config
    );
    return response.data;
  }

  // Метод для загрузки файлов
  async upload(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<BaseSuccessResponseSchema> {
    const response: AxiosResponse<BaseSuccessResponseSchema> = await this.client.post(
      url,
      formData,
      {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config?.headers,
        },
      }
    );
    return response.data;
  }
}

// Экспортируем единственный экземпляр
export const apiClient = new ApiClient();
export default apiClient;
