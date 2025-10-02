import { useLogin, useLogout } from '@/lib/api/generated/authentication/authentication';
import { useGetMe } from '@/lib/api/generated/users/users';
import { apiClient } from '@/lib/api/client';
import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, Button } from 'react-native';

export function LoginForm() {
  const { data: user, refetch: refetchProfile } = useGetMe({
    query: {
      enabled: false, // Отключаем автоматический запрос
    },
  });
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    loginMutation.mutate(
      { data: { email, password } },
      {
        onSuccess: async (response) => {
          console.log('🔐 Login response:', response);

          if (response.data.accessToken && response.data.refreshToken) {
            await apiClient.setTokens(response.data.accessToken, response.data.refreshToken);
          }

          setIsLoggedIn(true);
          refetchProfile();
          Alert.alert('Успех', 'Вы успешно вошли в систему');
        },
        onError: (error: any) => {
          console.error('❌ Login error:', error);
          const errorMessage =
            error?.response?.data?.error?.message || error?.message || 'Произошла ошибка';
          Alert.alert('Ошибка', errorMessage);
        },
      }
    );
  };

  if (isLoggedIn && user) {
    return (
      <View className="p-4">
        <Text className="mb-2 text-lg font-semibold">
          Добро пожаловать, {user.data.displayName}!
        </Text>
        <Text className="text-gray-600">{user.data.email}</Text>
        <Button
          title="Выйти"
          onPress={() => {
            logoutMutation.mutate();
            setIsLoggedIn(false);
            refetchProfile();
          }}
        />

        <Button
          title="Запросить профиль"
          onPress={() => {
            refetchProfile();
          }}
        />
      </View>
    );
  }

  return (
    <View className="w-full p-4">
      <TextInput
        className="mb-3 w-full rounded-lg border border-gray-300 p-3"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        className="mb-4 w-full rounded-lg border border-gray-300 p-3"
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        className={`rounded-lg bg-blue-500 p-3 ${loginMutation.isPending ? 'opacity-50' : ''}`}
        onPress={handleLogin}
        disabled={loginMutation.isPending}>
        <Text className="text-center font-semibold text-white">
          {loginMutation.isPending ? 'Вход...' : 'Войти'}
        </Text>
      </TouchableOpacity>

      <Button
        title="Запросить профиль"
        onPress={() => {
          refetchProfile();
        }}
      />
    </View>
  );
}
