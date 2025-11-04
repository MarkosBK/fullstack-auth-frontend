import { useCallback, useEffect, useState } from 'react';
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
import { paths } from '@/lib/utils/paths';
import { useResendTimer } from '@/lib/hooks';
import { STORAGE_KEYS } from '@/lib/utils/storage';
import { authStore } from '@/stores/auth.store';

// Validation schema for password reset request
const createResetPasswordRequestValidationSchema = (t: any) =>
  z.object({
    email: z
      .string()
      .trim()
      .min(1, t('validation.email.required'))
      .email(t('validation.email.invalid')),
  });

type ResetPasswordRequestFormData = z.infer<
  ReturnType<typeof createResetPasswordRequestValidationSchema>
>;

const ResetPasswordRequestScreen = () => {
  const { t } = useTranslation();
  const { requestPasswordReset } = useAuth();
  const [serverError, setServerError] = useState<ApiError | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);

  const { timeLeft, canResend, formatTime, startResendTimer } = useResendTimer({
    timerKey: STORAGE_KEYS.RESET_PASSWORD_RESEND_TIMER,
  });

  const resetPasswordRequestValidationSchema = createResetPasswordRequestValidationSchema(t);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ResetPasswordRequestFormData>({
    resolver: zodResolver(resetPasswordRequestValidationSchema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = useCallback(
    async (data: ResetPasswordRequestFormData) => {
      AppHaptics.buttonPress();
      setServerError(null);
      setIsRequesting(true);

      try {
        await requestPasswordReset(data.email);
        AppHaptics.success();
        startResendTimer();
      } catch (error: any) {
        AppHaptics.error();
        setServerError(error);
        console.log('Password reset request error:', error);
      } finally {
        setIsRequesting(false);
      }
    },
    [requestPasswordReset, startResendTimer]
  );

  const resetPasswordUser = authStore((state) => state.resetPasswordUser);

  useEffect(() => {
    if (resetPasswordUser) {
      setValue('email', resetPasswordUser.email);
    }
  }, [resetPasswordUser, setValue]);

  return (
    <AuthLayout showBackButton={true}>
      <View className="w-full">
        <HeadlineLarge className="mb-4 text-start text-4xl font-bold leading-tight">
          {t('auth.resetPassword.title')}
        </HeadlineLarge>

        <BodyMedium className="mb-8 leading-6 text-text-600">
          {t('auth.resetPassword.subtitle')}
        </BodyMedium>

        <View className="mb-6">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label={t('auth.email')}
                placeholder={t('auth.emailPlaceholder')}
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            )}
          />
        </View>

        <ServerError error={serverError} onDismiss={() => setServerError(null)} />

        {canResend ? (
          <Button
            size="large"
            loading={isRequesting}
            onPress={handleSubmit(onSubmit)}
            className="mb-6">
            {t('auth.resetPassword.requestButton')}
          </Button>
        ) : (
          <View className="bg-text-100 mb-6 flex items-center justify-center rounded-xl py-4">
            <BodyMedium className="text-text-500">
              {t('auth.resetPassword.nextSendIn')} {formatTime(timeLeft)}
            </BodyMedium>
          </View>
        )}

        <Link href={paths.auth.signIn.path} replace className="self-center">
          <View className="flex flex-row gap-2">
            <BodyMedium className="font-medium">
              {t('auth.resetPassword.rememberPassword')}
            </BodyMedium>
            <BodyMedium className="font-medium text-primary-500">{t('auth.signIn')}</BodyMedium>
          </View>
        </Link>
      </View>
    </AuthLayout>
  );
};

export default ResetPasswordRequestScreen;
