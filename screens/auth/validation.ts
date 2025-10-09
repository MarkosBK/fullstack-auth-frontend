import { z } from 'zod';
import { TFunction } from 'i18next';

/**
 * Создает схему валидации для входа
 */
export const createLoginValidationSchema = (t: TFunction) =>
  z.object({
    email: z
      .string()
      .trim()
      .min(1, t('validation.email.required'))
      .email(t('validation.email.invalid')),
    password: z
      .string()
      .trim()
      .min(1, t('validation.password.required'))
      .min(6, t('validation.password.minLength')),
  });

/**
 * Создает схему валидации для регистрации
 */
export const createRegisterValidationSchema = (t: TFunction) =>
  z
    .object({
      email: z
        .string()
        .trim()
        .min(1, t('validation.email.required'))
        .email(t('validation.email.invalid')),
      password: z
        .string()
        .trim()
        .min(1, t('validation.password.required'))
        .min(6, t('validation.password.minLength'))
        .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, t('validation.password.complexity')),
      confirmPassword: z.string().trim().min(1, t('validation.confirmPassword.required')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('validation.confirmPassword.mismatch'),
      path: ['confirmPassword'],
    });

/**
 * Создает схему валидации для восстановления пароля
 */
export const createForgotPasswordValidationSchema = (t: TFunction) =>
  z.object({
    email: z
      .string()
      .trim()
      .min(1, t('validation.email.required'))
      .email(t('validation.email.invalid')),
  });

/**
 * Типы для форм
 */
export type LoginFormData = z.infer<ReturnType<typeof createLoginValidationSchema>>;
export type RegisterFormData = z.infer<ReturnType<typeof createRegisterValidationSchema>>;
export type ForgotPasswordFormData = z.infer<
  ReturnType<typeof createForgotPasswordValidationSchema>
>;
