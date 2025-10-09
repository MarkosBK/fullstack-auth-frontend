import { useCallback } from 'react';
import { View, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/providers/AuthProvider';
import { getErrorMessage } from '@/lib/utils/errorHandler';
import { AppHaptics } from '@/lib/utils/haptics';
import { paths } from '@/lib/utils/paths';
import { AuthLayout } from '@/screens/auth/layout';
import { Input, Button, Link } from '@/components/common';
import { BodyMedium, HeadlineLarge } from '@/components/typography';
import { createLoginValidationSchema, type LoginFormData } from './validation';

const LoginScreen = () => {
  const { t } = useTranslation();
  const { login, isLoading } = useAuth();

  const loginValidationSchema = createLoginValidationSchema(t);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginValidationSchema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      AppHaptics.buttonPress();

      const validationResult = loginValidationSchema.safeParse(data);
      if (!validationResult.success) {
        AppHaptics.error();
        return;
      }

      try {
        await login(data.email, data.password);
        AppHaptics.success();
      } catch (error: any) {
        AppHaptics.error();
        const errorMessage = getErrorMessage(error);
        Alert.alert('Ошибка', errorMessage);
      }
    },
    [login, loginValidationSchema]
  );

  return (
    <AuthLayout showBackButton={false}>
      <View className="w-full">
        <HeadlineLarge className="mb-12 text-start text-4xl font-bold leading-tight">
          {t('auth.login.title')}
        </HeadlineLarge>

        <View className="mb-4 flex flex-col gap-4">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder={t('auth.login.email')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                size="large"
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder={t('auth.login.password')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                autoComplete="password"
                size="large"
                error={errors.password?.message}
              />
            )}
          />
        </View>

        <Link href={paths.auth.forgotPassword.path} className="mb-10 self-end">
          {t('auth.login.forgotPassword')}
        </Link>

        <Button size="large" loading={isLoading} onPress={handleSubmit(onSubmit)} className="mb-10">
          {t('auth.login.button')}
        </Button>

        <Link href={paths.auth.register.path} replace className="self-center">
          <View className="flex flex-row gap-2">
            <BodyMedium className="font-medium">{t('auth.login.noAccount')}</BodyMedium>
            <BodyMedium className="font-medium text-primary-500">
              {t('auth.login.registerNow')}
            </BodyMedium>
          </View>
        </Link>
      </View>
    </AuthLayout>
  );
};

export default LoginScreen;
