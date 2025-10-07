import React, { useCallback } from 'react';
import { View, TouchableOpacity, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/providers/ThemeProvider';

interface AuthLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export const AuthLayout = ({ children, showBackButton = true, onBackPress }: AuthLayoutProps) => {
  const { themeColors, isDark } = useTheme();

  const handleBackPress = useCallback(() => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  }, [onBackPress]);

  return (
    <View className="flex-1">
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <LinearGradient
        key={`gradient-${isDark ? 'dark' : 'light'}`}
        colors={[themeColors['background-300'], themeColors['background-700']]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      {/* Фоновое изображение */}
      {/* <ImageBackground
        source={require('@/assets/images/backround.png')}
        resizeMode="cover"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      /> */}

      {/* Размытие сверху */}
      {/* <BlurView className="absolute left-0 right-0 top-0 h-full" intensity={40} tint={'dark'} /> */}

      {/* Декоративный эллипс как в Figma */}
      {/* Контент */}
      <View className="flex-1 px-6 pt-16">
        {/* Навигация назад */}
        {showBackButton && (
          <TouchableOpacity
            onPress={handleBackPress}
            className="mb-8 h-11 w-11 items-center justify-center rounded-full border border-primary-200/50 bg-primary-200/20">
            <Feather name="arrow-left" size={20} color={themeColors.primary} />
          </TouchableOpacity>
        )}

        {/* Основной контент */}
        <View className="flex-1 justify-center">{children}</View>
      </View>
    </View>
  );
};
