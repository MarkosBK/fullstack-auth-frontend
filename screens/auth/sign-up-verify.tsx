import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/providers/AuthProvider';
import { AppHaptics } from '@/lib/utils/haptics';
import { AuthLayout } from '@/screens/auth/layout';
import { Button, Link, ServerError, OTPInput } from '@/components/common';
import { BodyMedium, HeadlineLarge } from '@/components/typography';
import { ApiError } from '@/lib/api/client';

const SignUpVerifyScreen = () => {
  const { t } = useTranslation();
  const { verifyOTP } = useAuth();
  const [serverError, setServerError] = useState<ApiError | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpCode, setOtpCode] = useState<string>('');

  const submit = useCallback(
    async (code: string) => {
      setServerError(null);
      setIsVerifying(true);

      try {
        await verifyOTP(code);
        AppHaptics.success();
      } catch (error: any) {
        AppHaptics.error();
        setServerError(error);
      } finally {
        setIsVerifying(false);
      }
    },
    [verifyOTP]
  );

  const onSubmitClick = useCallback(async () => {
    AppHaptics.buttonPress();
    submit(otpCode);
  }, [otpCode, submit]);

  const handleResendCode = useCallback(() => {
    AppHaptics.buttonPress();
    setServerError(null);

    // TODO: Интегрировать с API для повторной отправки кода
    console.log('Resending OTP code');

    // Очищаем текущий код
    setOtpCode('');
  }, []);

  const onChangeOtpCode = useCallback((code: string) => {
    setServerError(null);
    setOtpCode(code);
  }, []);

  return (
    <AuthLayout showBackButton={true}>
      <View className="w-full">
        <HeadlineLarge className="mb-4 text-start text-4xl font-bold leading-tight">
          {t('auth.otp.title')}
        </HeadlineLarge>

        <BodyMedium className="mb-8 leading-6 text-text-600">{t('auth.otp.subtitle')}</BodyMedium>

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
          {t('auth.otp.verifyButton')}
        </Button>

        <View className="flex-row items-center justify-center gap-2">
          <BodyMedium className="text-text-600">{t('auth.otp.didntReceive')}</BodyMedium>
          <Link onPress={handleResendCode}>
            <BodyMedium className="font-medium text-primary-500">
              {t('auth.otp.resendCode')}
            </BodyMedium>
          </Link>
        </View>
      </View>
    </AuthLayout>
  );
};

export default SignUpVerifyScreen;
