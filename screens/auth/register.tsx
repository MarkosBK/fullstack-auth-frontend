import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/providers/AuthProvider';
import { AppHaptics } from '@/lib/utils/haptics';
import { paths } from '@/lib/utils/paths';
import { AuthLayout } from '@/screens/auth/layout';
import { Input, Button, Link, ServerError } from '@/components/common';
import { BodyMedium, HeadlineLarge } from '@/components/typography';
import { createRegisterValidationSchema, type RegisterFormData } from './validation';
import { ApiError } from '@/lib/api/client';

const RegisterScreen = () => {
  const { t } = useTranslation();
  const { register, isLoading } = useAuth();
  const [serverError, setServerError] = useState<ApiError | null>(null);

  const registerValidationSchema = createRegisterValidationSchema(t);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerValidationSchema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = useCallback(
    async (data: RegisterFormData) => {
      AppHaptics.buttonPress();
      setServerError(null);

      const validationResult = registerValidationSchema.safeParse(data);
      if (!validationResult.success) {
        AppHaptics.error();
        return;
      }

      try {
        await register(data.email, data.password, data.confirmPassword);
        AppHaptics.success();
      } catch (error: any) {
        AppHaptics.error();
        setServerError(error);
        console.log('error', error);
      }
    },
    [register, registerValidationSchema]
  );

  return (
    <AuthLayout showBackButton={false}>
      <View className="w-full">
        <HeadlineLarge className="mb-12 text-start text-4xl font-bold leading-tight">
          {t('auth.register.title')}
        </HeadlineLarge>

        <View className="mb-4 flex flex-col gap-4">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder={t('auth.register.email')}
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
                placeholder={t('auth.register.password')}
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

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder={t('auth.register.confirmPassword')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                autoComplete="password"
                size="large"
                error={errors.confirmPassword?.message}
              />
            )}
          />
        </View>

        <ServerError error={serverError} onDismiss={() => setServerError(null)} />

        <Button size="large" loading={isLoading} onPress={handleSubmit(onSubmit)} className="mb-10">
          {t('auth.register.button')}
        </Button>

        <Link href={paths.auth.login.path} replace className="self-center">
          <View className="flex flex-row gap-2">
            <BodyMedium className="font-medium">{t('auth.register.hasAccount')}</BodyMedium>
            <BodyMedium className="font-medium text-primary-500">
              {t('auth.register.loginNow')}
            </BodyMedium>
          </View>
        </Link>
      </View>
    </AuthLayout>
  );
};

export default RegisterScreen;
