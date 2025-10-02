import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, Button } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { getErrorMessage } from '@/lib/utils/errorHandler';

export function LoginForm() {
  const { currentUser, isAuthenticated, isLoading, login, logout, refetchUser } = useAuth();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    try {
      await login(email, password);
      Alert.alert('Успех', 'Вы успешно вошли в систему');
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      Alert.alert('Ошибка', errorMessage);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert('Успех', 'Вы вышли из системы');
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      Alert.alert('Ошибка', errorMessage);
    }
  };

  if (isAuthenticated && currentUser) {
    return (
      <View className="p-4">
        <Text className="mb-2 text-lg font-semibold">
          Добро пожаловать, {currentUser.displayName || 'Пользователь'}!
        </Text>
        <Text className="text-gray-600">{currentUser.email}</Text>

        <Button title="Выйти" onPress={handleLogout} disabled={isLoading} />

        <Button title="Обновить профиль" onPress={() => refetchUser()} disabled={isLoading} />
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
        className={`rounded-lg bg-blue-500 p-3 ${isLoading ? 'opacity-50' : ''}`}
        onPress={handleLogin}
        disabled={isLoading}>
        <Text className="text-center font-semibold text-white">
          {isLoading ? 'Вход...' : 'Войти'}
        </Text>
      </TouchableOpacity>

      <Button title="Проверить профиль" onPress={() => refetchUser()} disabled={isLoading} />
    </View>
  );
}
