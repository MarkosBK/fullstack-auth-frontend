import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/providers/AuthProvider';
import { AppHaptics } from '@/lib/utils/haptics';
import { AuthLayout } from '@/screens/auth/layout';
import { Button, Link, ServerError, Input } from '@/components/common';
import { BodyMedium, HeadlineLarge } from '@/components/typography';
import { ApiError } from '@/lib/api/client';

// Схема валидации для нового пароля
const createNewPasswordValidationSchema = (t: any) =>
  z
    .object({
      newPassword: z
        .string()
        .trim()
        .min(6, t('validation.password.minLength'))
        .max(100, t('validation.password.maxLength')),
      confirmPassword: z
        .string()
        .trim()
        .min(6, t('validation.password.minLength'))
        .max(100, t('validation.password.maxLength')),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('validation.password.mismatch'),
      path: ['confirmPassword'],
    });

type NewPasswordFormData = z.infer<ReturnType<typeof createNewPasswordValidationSchema>>;

const ResetPasswordScreen = () => {
  const { t } = useTranslation();
  const { resetPassword } = useAuth();
  const [serverError, setServerError] = useState<ApiError | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const newPasswordValidationSchema = createNewPasswordValidationSchema(t);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordValidationSchema),
    mode: 'onSubmit',
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = useCallback(
    async (data: NewPasswordFormData) => {
      AppHaptics.buttonPress();
      setServerError(null);
      setIsResetting(true);

      try {
        await resetPassword(data.newPassword);
        AppHaptics.success();
        console.log('Password reset successfully');

        // TODO: Редирект на экран входа
      } catch (error: any) {
        AppHaptics.error();
        setServerError(error);
        console.log('Password reset error:', error);
      } finally {
        setIsResetting(false);
      }
    },
    [resetPassword]
  );

  return (
    <AuthLayout showBackButton={true}>
      <View className="w-full">
        <HeadlineLarge className="mb-4 text-start text-4xl font-bold leading-tight">
          {t('auth.resetPassword.newPasswordTitle')}
        </HeadlineLarge>

        <BodyMedium className="mb-8 leading-6 text-text-600">
          {t('auth.resetPassword.newPasswordSubtitle')}
        </BodyMedium>

        <View className="mb-6">
          <Controller
            control={control}
            name="newPassword"
            render={({ field: { onChange, value } }) => (
              <Input
                label={t('auth.newPassword')}
                placeholder={t('auth.newPasswordPlaceholder')}
                value={value}
                onChangeText={onChange}
                error={errors.newPassword?.message}
                secureTextEntry={true}
                autoComplete="new-password"
                autoFocus={true}
              />
            )}
          />
        </View>

        <View className="mb-6">
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <Input
                label={t('auth.confirmPassword')}
                placeholder={t('auth.confirmPasswordPlaceholder')}
                value={value}
                onChangeText={onChange}
                error={errors.confirmPassword?.message}
                secureTextEntry={true}
                autoComplete="new-password"
              />
            )}
          />
        </View>

        <ServerError error={serverError} onDismiss={() => setServerError(null)} />

        <Button
          size="large"
          loading={isResetting}
          onPress={handleSubmit(onSubmit)}
          className="mb-6">
          {t('auth.resetPassword.resetButton')}
        </Button>

        <View className="flex-row items-center justify-center gap-2">
          <BodyMedium className="text-text-600">
            {t('auth.resetPassword.rememberPassword')}
          </BodyMedium>
          <Link href="/sign-in">
            <BodyMedium className="font-medium text-primary-500">{t('auth.signIn')}</BodyMedium>
          </Link>
        </View>
      </View>
    </AuthLayout>
  );
};

export default ResetPasswordScreen;
