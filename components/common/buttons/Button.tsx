import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, ActivityIndicator, View } from 'react-native';
import { cn } from '@/lib/utils/cn';
import { LabelLarge } from '@/components/typography';
import { useTheme } from '@/stores/theme.store';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'glass';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<View, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      loading = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const { themeColors } = useTheme();

    const baseClasses = 'rounded-3xl items-center justify-center flex-row';

    const sizeClasses = {
      small: 'py-4 px-6',
      medium: 'py-5 px-8',
      large: 'py-7 px-10',
    };

    const variantClasses = {
      primary: 'bg-background-300 border border-background-400',
      secondary: 'bg-background-200 border border-background-300',
      outline: 'bg-transparent border border-background-400',
      glass: 'bg-white/10 border border-white/20',
    };

    const textColorClasses = {
      primary: 'text-text-500',
      secondary: 'text-text-500',
      outline: 'text-text-600',
      glass: 'text-text-500',
    };

    const isDisabled = disabled || loading;

    return (
      <TouchableOpacity
        ref={ref}
        className={cn(
          baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          isDisabled && 'opacity-50',
          className
        )}
        style={{
          borderColor: themeColors['background-400'],
        }}
        disabled={isDisabled}
        {...props}>
        {loading && (
          <ActivityIndicator size="small" color={themeColors['text-500']} className="mr-2" />
        )}

        <LabelLarge className={cn(textColorClasses[variant], 'font-semibold')}>
          {children}
        </LabelLarge>
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';
