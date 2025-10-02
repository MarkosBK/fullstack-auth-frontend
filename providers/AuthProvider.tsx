import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useGetMe } from '@/lib/api/generated/users/users';
import { useLogin, useLogout } from '@/lib/api/generated/authentication/authentication';
import { apiClient } from '@/lib/api/client';
import { useQueryClient } from '@tanstack/react-query';

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthContext = createContext<ReturnType<typeof useProvideAuth> | undefined>(undefined);

const useProvideAuth = () => {
  const queryClient = useQueryClient();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const {
    data: userData,
    isLoading: isLoadingUser,
    refetch: refetchUser,
    error: userError,
  } = useGetMe({
    query: {
      enabled: false, // Не загружаем автоматически
      retry: false, // Не повторяем при ошибке
    },
  });

  const checkAuthStatus = useCallback(async () => {
    const token = await apiClient.getAccessToken();
    if (token) {
      refetchUser();
    }
  }, [refetchUser]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        loginMutation.mutate(
          { data: { email, password } },
          {
            onSuccess: async (response) => {
              try {
                if (response.data.accessToken && response.data.refreshToken) {
                  await apiClient.setTokens(response.data.accessToken, response.data.refreshToken);
                  await refetchUser();
                  queryClient.invalidateQueries();

                  resolve();
                } else {
                  reject(new Error('Tokens not received'));
                }
              } catch (error) {
                reject(error);
              }
            },
            onError: (error) => {
              reject(error);
            },
          }
        );
      });
    },
    [loginMutation, queryClient, refetchUser]
  );

  const logout = useCallback(async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      logoutMutation.mutate(undefined, {
        onSuccess: async () => {
          try {
            await apiClient.logout();

            queryClient.clear();

            resolve();
          } catch (error) {
            reject(error);
          }
        },
        onError: (error) => {
          // Даже если логаут на сервере не удался, очищаем локальные данные
          apiClient.logout();
          queryClient.clear();
          reject(error);
        },
      });
    });
  }, [logoutMutation, queryClient]);

  const isAuthenticated = useMemo(() => !!userData && !userError, [userData, userError]);

  const isLoading = useMemo(
    () => isLoadingUser || loginMutation.isPending || logoutMutation.isPending,
    [isLoadingUser, loginMutation.isPending, logoutMutation.isPending]
  );

  return {
    currentUser: userData?.data || null,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refetchUser,
  };
};

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
