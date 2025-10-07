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
export type ApiError = { status: number } & (
  | ValidationErrorSchema
  | ApiErrorSchema
  | NotFoundErrorSchema
  | ConflictErrorSchema
);

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

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // REQUEST INTERCEPTOR
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // RESPONSE INTERCEPTOR
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          const isAuthEndpoint = originalRequest.url?.includes('/auth');
          if (isAuthEndpoint) {
            return Promise.reject(this.handleError(error));
          }

          if (this.isRefreshing) {
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
              const response = await axios.post(`${API_BASE_URL}/v1/auth/refresh`, {
                refreshToken,
              });

              const { accessToken, refreshToken: newRefreshToken } = response.data.data;
              await AsyncStorage.setItem(TOKEN_KEY, accessToken);
              await AsyncStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);

              this.processQueue(null, accessToken);
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
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
      const errorData = error.response.data as ApiErrorSchema;

      if (errorData?.error) {
        return {
          status: error.response.status,
          ...errorData,
        };
      } else {
        return {
          status: error.response.status,
          success: false,
          error: {
            message: error.response.data?.message || 'Something went wrong',
            timestamp: new Date().toISOString(),
            path: error.request?.config?.url || '',
            method: error.request?.config?.method || '',
          },
        };
      }
    } else if (error.request) {
      // REQUEST SENT, BUT NO RESPONSE
      return {
        status: error.response.status,
        success: false,
        error: {
          message: 'No connection to the server',
          timestamp: new Date().toISOString(),
          path: error.request?.config?.url || '',
          method: error.request?.config?.method || '',
        },
      };
    } else {
      // SOMETHING WENT WRONG SETTING UP THE REQUEST
      return {
        status: error.response.status,
        success: false,
        error: {
          message: error.message || 'Something went wrong',
          timestamp: new Date().toISOString(),
          path: error.request?.config?.url || '',
          method: error.request?.config?.method || '',
        },
      };
    }
  }

  async setTokens(token: string, refreshToken: string) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  async getAccessToken(): Promise<string | null> {
    return AsyncStorage.getItem(TOKEN_KEY);
  }

  async logout() {
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
  }

  // BASE HTTP METHODS
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

  // UPLOAD FILES
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

export const apiClient = new ApiClient();
export default apiClient;
