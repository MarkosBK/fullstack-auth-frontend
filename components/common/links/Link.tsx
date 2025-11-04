import React, { useCallback, useMemo } from 'react';
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { router, Href } from 'expo-router';
import { cn } from '@/lib/utils/cn';
import { BodyLarge, BodyMedium, BodySmall } from '@/components/typography';
import { useTheme } from '@/stores/theme.store';
import { AppHaptics } from '@/lib/utils/haptics';

interface LinkProps extends TouchableOpacityProps {
  variant?: 'default' | 'primary' | 'secondary' | 'error';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  onPress?: () => void;
  href?: Href;
  replace?: boolean;
}

export const Link = React.forwardRef<View, LinkProps>(
  (
    {
      variant = 'default',
      size = 'medium',
      className,
      children,
      onPress,
      href,
      replace = false,
      ...props
    },
    ref
  ) => {
    const { themeColors } = useTheme();

    const handlePress = useCallback(() => {
      AppHaptics.navigation(); // Vibration when clicking link

      if (href) {
        if (replace) {
          router.replace(href); // Replace current screen
        } else {
          router.push(href); // Add to navigation stack
        }
      } else {
        onPress?.();
      }
    }, [href, replace, onPress]);

    const sizeComponents = useMemo(
      () => ({
        small: BodySmall,
        medium: BodyMedium,
        large: BodyLarge,
      }),
      []
    );

    const variantStyles = useMemo(
      () => ({
        default: { color: themeColors['text-500'] },
        primary: { color: themeColors['primary'] },
        secondary: { color: themeColors['text-600'] },
        error: { color: themeColors['error-500'] },
      }),
      [themeColors]
    );

    const isString = useMemo(() => typeof children === 'string', [children]);

    return (
      <TouchableOpacity
        ref={ref}
        className={cn('self-start', className)}
        onPress={handlePress}
        {...props}>
        {isString
          ? React.createElement(
              sizeComponents[size],
              {
                className: 'font-medium',
                style: variantStyles[variant],
              },
              children
            )
          : children}
      </TouchableOpacity>
    );
  }
);

Link.displayName = 'Link';
