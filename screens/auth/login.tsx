import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/providers/AuthProvider';
import { getErrorMessage } from '@/lib/utils/errorHandler';
import { paths } from '@/lib/utils/paths';
import { AuthLayout } from '@/components/auth/layout';
import { Input, Button } from '@/components/common';
import { HeadlineLarge, BodyMedium } from '@/components/typography';
import { useTheme } from '@/providers/ThemeProvider';

const LoginScreen = () => {
  const { t } = useTranslation();
  const { login, isLoading } = useAuth();
  const { themeColors } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = useCallback(() => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Неверный формат email';
    }

    if (!password.trim()) {
      newErrors.password = 'Пароль обязателен';
    } else if (password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password]);

  const handleLogin = useCallback(async () => {
    if (!validateForm()) return;

    try {
      await login(email, password);
      // Успешный вход - редирект произойдет автоматически через AuthProvider
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      Alert.alert('Ошибка', errorMessage);
    }
  }, [validateForm, login, email, password]);

  const handleForgotPassword = useCallback(() => {
    router.push(paths.auth.forgotPassword.path);
  }, []);

  const handleRegister = useCallback(() => {
    router.push(paths.auth.register.path);
  }, []);

  return (
    <AuthLayout showBackButton={false}>
      <View className="w-full">
        {/* Заголовок как в Figma */}
        <HeadlineLarge className="mb-12 text-start text-4xl font-bold leading-tight">
          {t('auth.login.title')}
        </HeadlineLarge>

        {/* <ThemeToggle /> */}

        {/* Поля ввода */}
        <View className="mb-4 flex flex-col gap-4">
          <Input
            placeholder={t('auth.login.email')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            size="large"
            error={errors.email}
          />

          <Input
            placeholder={t('auth.login.password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            size="large"
            error={errors.password}
          />
        </View>

        {/* Забыли пароль */}
        <TouchableOpacity onPress={handleForgotPassword} className="mb-10 self-end">
          <BodyMedium className="text-base font-medium" style={{ color: themeColors['text-500'] }}>
            {t('auth.login.forgotPassword')}
          </BodyMedium>
        </TouchableOpacity>

        {/* Кнопка входа */}
        <Button size="large" loading={isLoading} onPress={handleLogin} className="mb-10">
          {t('auth.login.button')}
        </Button>

        {/* Регистрация */}
        <TouchableOpacity onPress={handleRegister} className="self-center">
          <BodyMedium
            className="text-center text-base font-medium"
            style={{ color: themeColors['text-500'] }}>
            {t('auth.login.noAccount')}
          </BodyMedium>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
};

export default LoginScreen;
