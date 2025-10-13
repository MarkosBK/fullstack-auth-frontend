import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useGetMe } from '@/lib/api/generated/users/users';
import {
  useLogin,
  useLogout,
  useRegister,
} from '@/lib/api/generated/authentication/authentication';
import { apiClient } from '@/lib/api/client';
import { useQueryClient } from '@tanstack/react-query';
import { type RouteConfig } from '@/lib/utils/paths';
import { RoleName } from '@/lib/api/generated/schemas';

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthContext = createContext<ReturnType<typeof useProvideAuth> | undefined>(undefined);

const useProvideAuth = () => {
  const queryClient = useQueryClient();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const registerMutation = useRegister();
  const [isLoadingCallback, setIsLoadingCallback] = useState(false);

  const {
    data: userData,
    isLoading: isLoadingUser,
    refetch: refetchUser,
    error: userError,
  } = useGetMe({
    query: {
      enabled: false, // not load automatically (on render)
      retry: false, // not retry on error
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

  const isAuthenticated = useMemo(() => !!userData && !userError, [userData, userError]);

  const isLoading = useMemo(
    () =>
      isLoadingUser ||
      loginMutation.isPending ||
      logoutMutation.isPending ||
      registerMutation.isPending ||
      isLoadingCallback,
    [
      isLoadingUser,
      loginMutation.isPending,
      logoutMutation.isPending,
      registerMutation.isPending,
      isLoadingCallback,
    ]
  );

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      setIsLoadingCallback(true);
      return new Promise((resolve, reject) => {
        loginMutation.mutate(
          { data: { email: email.trim(), password: password.trim() } },
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
              } finally {
                setIsLoadingCallback(false);
              }
            },
            onError: (error) => {
              setIsLoadingCallback(false);
              reject(error);
            },
          }
        );
      });
    },
    [loginMutation, queryClient, refetchUser]
  );

  const register = useCallback(
    async (email: string, password: string, confirmPassword: string): Promise<void> => {
      setIsLoadingCallback(true);
      return new Promise((resolve, reject) => {
        registerMutation.mutate(
          { data: { email: email.trim(), password: password.trim() } },
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
              } finally {
                setIsLoadingCallback(false);
              }
            },
            onError: (error) => {
              setIsLoadingCallback(false);
              reject(error);
            },
          }
        );
      });
    },
    [registerMutation, queryClient, refetchUser]
  );

  const logout = useCallback(async (): Promise<void> => {
    setIsLoadingCallback(true);
    return new Promise((resolve, reject) => {
      logoutMutation.mutate(undefined, {
        onSuccess: async () => {
          try {
            await apiClient.logout();

            queryClient.clear();
            resolve();
          } catch (error) {
            reject(error);
          } finally {
            setIsLoadingCallback(false);
          }
        },
        onError: (error) => {
          apiClient.logout();
          queryClient.clear();
          setIsLoadingCallback(false);
          reject(error);
        },
      });
    });
  }, [logoutMutation, queryClient]);

  const hasRole = useCallback(
    (role: RoleName[]): boolean => {
      const currentUser = userData?.data || null;
      return currentUser?.roles?.some((r) => role.includes(r.name)) || false;
    },
    [userData]
  );

  const canAccessRoute = useCallback(
    (routeConfig: RouteConfig): boolean => {
      if (!routeConfig) return true;

      if (routeConfig.auth && !isAuthenticated) {
        return false;
      }

      if (routeConfig.roles && routeConfig.roles.length > 0) {
        const currentUser = userData?.data || null;
        const userRoles = currentUser?.roles?.map((r) => r.name) || [];
        const hasRequiredRole = routeConfig.roles.some((role) => userRoles.includes(role));

        if (!hasRequiredRole) {
          return false;
        }
      }

      // check permissions (when they will be on the server)
      // if (routeConfig.permissions && routeConfig.permissions.length > 0) {
      //   const currentUser = userData?.data || null;
      //   const hasAllPermissions = routeConfig.permissions.every((permission) =>
      //     currentUser?.permissions?.includes(permission)
      //   );
      //   if (!hasAllPermissions) {
      //     return false;
      //   }
      // }

      if (routeConfig.customCheck) {
        const currentUser = userData?.data || null;
        return routeConfig.customCheck(currentUser);
      }

      return true;
    },
    [isAuthenticated, userData]
  );

  // check permissions (when they will be on the server)
  // const hasPermission = useCallback((permission: string): boolean => {
  //   return currentUser?.permissions?.includes(permission) || false;
  // }, [currentUser]);

  return {
    currentUser: userData?.data || null,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refetchUser,
    hasRole,
    canAccessRoute,
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
