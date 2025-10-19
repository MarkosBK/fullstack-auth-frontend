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
import { createLoginValidationSchema, type LoginFormData } from './validation';
import { ApiError } from '@/lib/api/client';

const SignInScreen = () => {
  const { t } = useTranslation();
  const { signIn, isLoading } = useAuth();
  const [serverError, setServerError] = useState<ApiError | null>(null);

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
      setServerError(null); // Clear previous errors

      const validationResult = loginValidationSchema.safeParse(data);
      if (!validationResult.success) {
        AppHaptics.error();
        return;
      }

      try {
        await signIn(data.email, data.password);
        AppHaptics.success();
      } catch (error: any) {
        AppHaptics.error();
        setServerError(error); // Set server error
        console.log('error', error);
      }
    },
    [signIn, loginValidationSchema]
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

        <Link href={paths.auth.resetPasswordRequest.path} className="mb-10 self-end">
          {t('auth.login.forgotPassword')}
        </Link>

        <ServerError error={serverError} onDismiss={() => setServerError(null)} />

        <Button size="large" loading={isLoading} onPress={handleSubmit(onSubmit)} className="mb-10">
          {t('auth.login.button')}
        </Button>

        <Link href={paths.auth.signUp.path} replace className="self-center">
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

export default SignInScreen;
