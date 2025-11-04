import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { themes } from '../styles/color-theme';
import { useTheme } from '@/stores/theme.store';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { theme, isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={themes[theme]} className={'flex-1'}>
        {children}
      </View>
    </>
  );
};

// Re-export useTheme from store for backward compatibility
export { useTheme };
