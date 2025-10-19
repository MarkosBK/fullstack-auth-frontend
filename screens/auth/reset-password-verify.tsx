import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/providers/AuthProvider';
import { AppHaptics } from '@/lib/utils/haptics';
import { useResendTimer } from '@/lib/hooks';
import { STORAGE_KEYS } from '@/lib/utils/storage';
import { AuthLayout } from '@/screens/auth/layout';
import { Button, Link, ServerError, OTPInput } from '@/components/common';
import { BodyMedium, HeadlineLarge } from '@/components/typography';
import { ApiError } from '@/lib/api/client';

const ResetPasswordVerifyScreen = () => {
  const { t } = useTranslation();
  const { verifyPasswordReset, resendPasswordReset } = useAuth();
  const [serverError, setServerError] = useState<ApiError | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpCode, setOtpCode] = useState<string>('');

  // Resend timer hook
  const { timeLeft, canResend, startResendTimer, formatTime } = useResendTimer({
    autoStart: true,
    timerKey: STORAGE_KEYS.RESET_PASSWORD_RESEND_TIMER,
  });

  const submit = useCallback(
    async (code: string) => {
      setServerError(null);
      setIsVerifying(true);

      try {
        await verifyPasswordReset(code);
        AppHaptics.success();
      } catch (error: any) {
        AppHaptics.error();
        setServerError(error);
      } finally {
        setIsVerifying(false);
      }
    },
    [verifyPasswordReset]
  );

  const onSubmitClick = useCallback(async () => {
    AppHaptics.buttonPress();
    submit(otpCode);
  }, [otpCode, submit]);

  const handleResendCode = useCallback(async () => {
    if (!canResend) return;

    AppHaptics.buttonPress();
    setServerError(null);

    try {
      await resendPasswordReset();
      AppHaptics.success();
      setOtpCode('');
      startResendTimer(); // Restart timer after successful resend
    } catch (error: any) {
      AppHaptics.error();
      setServerError(error);
    }
  }, [resendPasswordReset, canResend, startResendTimer]);

  const onChangeOtpCode = useCallback((code: string) => {
    setServerError(null);
    setOtpCode(code);
  }, []);

  return (
    <AuthLayout showBackButton={true}>
      <View className="w-full">
        <HeadlineLarge className="mb-4 text-start text-4xl font-bold leading-tight">
          {t('auth.resetPassword.verifyTitle')}
        </HeadlineLarge>

        <BodyMedium className="mb-8 leading-6 text-text-600">
          {t('auth.resetPassword.verifySubtitle')}
        </BodyMedium>

        <View className="mb-6">
          <OTPInput
            value={otpCode}
            onChangeText={onChangeOtpCode}
            onComplete={submit}
            disabled={isVerifying}
            autoFocus={true}
            isError={!!serverError}
          />
        </View>

        <ServerError error={serverError} onDismiss={() => setServerError(null)} />

        <Button
          size="large"
          loading={isVerifying}
          onPress={onSubmitClick}
          className="mb-6"
          disabled={otpCode.length !== 6}>
          {t('auth.resetPassword.verifyButton')}
        </Button>

        <View className="flex-row items-center justify-center gap-2">
          <BodyMedium className="text-text-600">{t('auth.resetPassword.didntReceive')}</BodyMedium>
          {canResend ? (
            <Link onPress={handleResendCode}>
              <BodyMedium className="font-medium text-primary-500">
                {t('auth.resetPassword.resendAvailable')}
              </BodyMedium>
            </Link>
          ) : (
            <BodyMedium className="font-medium text-text-500">
              {t('auth.resetPassword.resendIn')} {formatTime(timeLeft)}
            </BodyMedium>
          )}
        </View>
      </View>
    </AuthLayout>
  );
};

export default ResetPasswordVerifyScreen;
