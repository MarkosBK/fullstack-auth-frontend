import React, { useCallback } from 'react';
import { View, TouchableOpacity, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/providers/ThemeProvider';
import KeyboardScrollView from '@/components/common/keyboard/KeyboardScrollView';

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
      {/* Background image */}
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

      {/* Top blur */}
      {/* <BlurView className="absolute left-0 right-0 top-0 h-full" intensity={40} tint={'dark'} /> */}

      {/* Content */}
      <KeyboardScrollView className="flex-1 px-6 pt-16">
        {/* Back navigation */}
        {showBackButton && (
          <TouchableOpacity
            onPress={handleBackPress}
            className="mb-8 h-11 w-11 items-center justify-center rounded-full border border-primary-200/50 bg-primary-200/20">
            <Feather name="arrow-left" size={20} color={themeColors.primary} />
          </TouchableOpacity>
        )}

        {/* Main content */}
        <View className="flex-1 justify-center py-16">{children}</View>
      </KeyboardScrollView>
    </View>
  );
};
