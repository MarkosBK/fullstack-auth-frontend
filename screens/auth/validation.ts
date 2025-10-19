import { z } from 'zod';
import { TFunction } from 'i18next';

/**
 * Creates validation schema for login
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
 * Creates validation schema for registration
 */
export const createRegisterValidationSchema = (t: TFunction) =>
  z
    .object({
      displayName: z
        .string()
        .trim()
        .min(1, t('validation.displayName.required'))
        .min(2, t('validation.displayName.minLength'))
        .max(50, t('validation.displayName.maxLength')),
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
 * Creates validation schema for password reset
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
 * Form types
 */
export type LoginFormData = z.infer<ReturnType<typeof createLoginValidationSchema>>;
export type RegisterFormData = z.infer<ReturnType<typeof createRegisterValidationSchema>>;
export type ForgotPasswordFormData = z.infer<
  ReturnType<typeof createForgotPasswordValidationSchema>
>;
