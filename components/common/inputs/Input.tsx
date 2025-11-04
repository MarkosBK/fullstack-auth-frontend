import React, { useState } from 'react';
import { TextInput, TextInputProps, View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { cn } from '@/lib/utils/cn';
import { BodyMedium } from '@/components/typography';
import { useTheme } from '@/stores/theme.store';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  variant?: 'default' | 'outlined' | 'glass';
  size?: 'small' | 'medium' | 'large';
}

export const Input = React.forwardRef<TextInput, InputProps>(
  (
    { label, error, variant = 'default', size = 'medium', className, secureTextEntry, ...props },
    ref
  ) => {
    const { themeColors } = useTheme();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const baseClasses = 'rounded-3xl border text-text-500';

    const sizeClasses = {
      small: 'py-4 px-6 text-sm leading-[16px]',
      medium: 'py-5 px-6 text-base leading-[18px]',
      large: 'py-7 px-6 text-lg leading-[20px]',
    };

    const variantClasses = {
      default: 'bg-background-300 border-background-400',
      outlined: 'bg-transparent border-background-400',
      glass: 'bg-white/10 border-white/20',
    };

    const errorClasses = {
      default: 'bg-error-500/5',
      outlined: 'bg-error-500/5',
      glass: 'bg-error-500/5',
    };

    const isPassword = secureTextEntry;
    const showPasswordToggle = isPassword;

    return (
      <View className="w-full">
        {label && <BodyMedium className="mb-2 text-text-600">{label}</BodyMedium>}

        <View className="relative">
          <TextInput
            ref={ref}
            className={cn(
              baseClasses,
              sizeClasses[size],
              variantClasses[variant],
              error && errorClasses[variant],
              showPasswordToggle && 'pr-14',
              className
            )}
            placeholderTextColor={`${themeColors['text-700']}`}
            placeholderClassName="p-0 m-0"
            secureTextEntry={isPassword ? !isPasswordVisible : false}
            {...props}
          />

          {showPasswordToggle && (
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute right-2 top-1/2 h-10 w-10 -translate-y-1/2 items-center justify-center">
              <Feather
                name={isPasswordVisible ? 'eye-off' : 'eye'}
                size={20}
                color={themeColors['text-600']}
              />
            </TouchableOpacity>
          )}
        </View>

        {error && <BodyMedium className="mt-1 text-error-500">{error}</BodyMedium>}
      </View>
    );
  }
);

Input.displayName = 'Input';
