import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useGetMe } from '@/lib/api/generated/users/users';
import {
  useLogout,
  useResetPassword,
  useResetPasswordResend,
  useResetPasswordRequest,
  useResetPasswordVerify,
  useSignIn,
  useSignUp,
  useSignUpVerify,
  useSignUpResend,
} from '@/lib/api/generated/authentication/authentication';
import { apiClient } from '@/lib/api/client';
import { useQueryClient } from '@tanstack/react-query';
import { paths, type RouteConfig } from '@/lib/utils/paths';
import { RegistrationStep, RoleName } from '@/lib/api/generated/schemas';
import { useRouter } from 'expo-router';
import { authStore } from '@/stores/auth.store';

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthContext = createContext<ReturnType<typeof useProvideAuth> | undefined>(undefined);

const useProvideAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const loginMutation = useSignIn();
  const logoutMutation = useLogout();
  const signUpMutation = useSignUp();
  const signUpResendMutation = useSignUpResend();
  const signUpVerifyMutation = useSignUpVerify();
  const resetPasswordRequestMutation = useResetPasswordRequest();
  const resetPasswordResendMutation = useResetPasswordResend();
  const resetPasswordVerifyMutation = useResetPasswordVerify();
  const resetPasswordMutation = useResetPassword();
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

  const isAuthenticated = useMemo(() => !!userData && !userError, [userData, userError]);

  const checkAuthStatus = useCallback(async () => {
    const token = await apiClient.getAccessToken();

    if (token) {
      refetchUser();
    }
  }, [refetchUser]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    console.log('isAuthenticated', isAuthenticated);
    if (isAuthenticated) {
      authStore.getState().clearAllTemporaryData();
    }
  }, [isAuthenticated, router]);

  const isLoading = useMemo(
    () =>
      isLoadingUser ||
      loginMutation.isPending ||
      logoutMutation.isPending ||
      signUpMutation.isPending ||
      signUpVerifyMutation.isPending ||
      signUpResendMutation.isPending ||
      isLoadingCallback,
    [
      isLoadingUser,
      loginMutation.isPending,
      logoutMutation.isPending,
      signUpMutation.isPending,
      signUpVerifyMutation.isPending,
      signUpResendMutation.isPending,
      isLoadingCallback,
    ]
  );

  const signIn = useCallback(
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

  const signUpResend = useCallback(async (): Promise<void> => {
    setIsLoadingCallback(true);
    const user = authStore.getState().registrationUser;

    if (!user) {
      router.push(paths.auth.signUp.path);
      return;
    }

    return new Promise((resolve, reject) => {
      signUpResendMutation.mutate(
        { data: { email: user.email.trim() } },
        {
          onSuccess: async (response) => {
            try {
              resolve();
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
  }, [router, signUpResendMutation]);
  const signUp = useCallback(
    async (email: string, password: string, displayName: string): Promise<void> => {
      setIsLoadingCallback(true);
      return new Promise((resolve, reject) => {
        signUpMutation.mutate(
          {
            data: {
              email: email.trim(),
              password: password.trim(),
              displayName: displayName.trim(),
            },
          },
          {
            onSuccess: async (response) => {
              try {
                if (response.data.step === RegistrationStep.EMAIL_OTP_VERIFICATION) {
                  authStore.getState().setRegistrationUser({ email, displayName });
                  router.push(paths.auth.signUpVerify.path);
                  resolve();
                } else if (response.data.step === 'COMPLETED') {
                  resolve();
                } else {
                  reject(new Error('Unknown registration step'));
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
    [signUpMutation, router]
  );

  const signUpVerify = useCallback(
    async (otpCode: string): Promise<void> => {
      setIsLoadingCallback(true);
      const user = authStore.getState().registrationUser;

      if (!user) {
        router.push(paths.auth.signUp.path);
        return;
      }

      return new Promise((resolve, reject) => {
        signUpVerifyMutation.mutate(
          { data: { email: user.email.trim(), otpCode: otpCode.trim() } },
          {
            onSuccess: async (response) => {
              try {
                if (response.data.accessToken && response.data.refreshToken) {
                  await apiClient.setTokens(response.data.accessToken, response.data.refreshToken);
                  await refetchUser();
                  queryClient.invalidateQueries();
                  authStore.getState().clearRegistrationUser();
                } else {
                  reject(new Error('Tokens not received'));
                }
                resolve();
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
    [queryClient, refetchUser, router, signUpVerifyMutation]
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

  const resendPasswordReset = useCallback(async (): Promise<void> => {
    setIsLoadingCallback(true);
    const user = authStore.getState().resetPasswordUser;

    if (!user) {
      router.push(paths.auth.signIn.path);
      return;
    }

    return new Promise((resolve, reject) => {
      resetPasswordResendMutation.mutate(
        { data: { email: user.email.trim() } },
        {
          onSuccess: async (response) => {
            try {
              resolve();
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
  }, [resetPasswordResendMutation, router]);

  const requestPasswordReset = useCallback(
    async (email: string): Promise<void> => {
      setIsLoadingCallback(true);
      return new Promise((resolve, reject) => {
        resetPasswordRequestMutation.mutate(
          { data: { email: email.trim() } },
          {
            onSuccess: async (response) => {
              try {
                authStore.getState().setResetPasswordUser({ email: email.trim() });
                router.push(paths.auth.resetPasswordVerify.path);
                resolve();
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
    [resetPasswordRequestMutation, router]
  );

  const verifyPasswordReset = useCallback(
    async (otpCode: string): Promise<void> => {
      setIsLoadingCallback(true);
      const user = authStore.getState().resetPasswordUser;

      if (!user) {
        router.push(paths.auth.signIn.path);
        return;
      }

      return new Promise((resolve, reject) => {
        resetPasswordVerifyMutation.mutate(
          { data: { email: user.email.trim(), otpCode: otpCode.trim() } },
          {
            onSuccess: async (response) => {
              try {
                authStore.getState().setResetPasswordUser({
                  email: user.email,
                  resetToken: response.data.resetToken,
                });
                router.push(paths.auth.resetPassword.path);
                resolve();
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
    [resetPasswordVerifyMutation, router]
  );

  const resetPassword = useCallback(
    async (newPassword: string): Promise<void> => {
      setIsLoadingCallback(true);
      const user = authStore.getState().resetPasswordUser;

      if (!user) {
        router.push(paths.auth.signIn.path);
        return;
      }

      return new Promise((resolve, reject) => {
        if (!user.resetToken) {
          reject(new Error('Reset token not found'));
          return;
        }

        resetPasswordMutation.mutate(
          { data: { resetToken: user.resetToken, newPassword: newPassword.trim() } },
          {
            onSuccess: async () => {
              try {
                authStore.getState().clearResetPasswordUser();
                router.push(paths.auth.signIn.path);
                resolve();
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
    [resetPasswordMutation, router]
  );

  const hasRole = useCallback(
    (role: RoleName[]): boolean => {
      const currentUser = userData?.data || null;
      return currentUser?.roles?.some((roleName) => role.includes(roleName)) || false;
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
        const userRoles = currentUser?.roles || [];
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
    signIn,
    signUp,
    signUpResend,
    signUpVerify,
    logout,
    requestPasswordReset,
    resendPasswordReset,
    verifyPasswordReset,
    resetPassword,
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
