import React, { createContext, useContext, useMemo, useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colorScheme } from 'nativewind';
import { themes } from '../styles/color-theme';
import { colors } from '@/styles/colors';

interface ThemeProviderProps {
  children: React.ReactNode;
}

type ThemeContextType = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  themeColors: Record<string, string>;
  isDark: boolean;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  themeColors: colors.light,
  isDark: false,
});

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  const themeColors = useMemo(() => {
    const colorsRes = colors[currentTheme];
    const processedColors: Record<string, string> = {};

    Object.entries(colorsRes).forEach(([color, value]) => {
      processedColors[color] = `rgb(${value})`;
    });

    return processedColors;
  }, [currentTheme]);

  const isDark = useMemo(() => {
    return currentTheme === 'dark';
  }, [currentTheme]);

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    colorScheme.set(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme, themeColors, isDark }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={themes[currentTheme]} className={'flex-1'}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
