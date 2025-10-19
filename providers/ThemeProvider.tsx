import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colorScheme } from 'nativewind';
import { themeStorage } from '@/lib/utils/storage';
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
  isLoading: boolean;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  themeColors: colors.light,
  isDark: false,
  isLoading: true,
});

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme on initialization
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedTheme = await themeStorage.getTheme();
        if (savedTheme) {
          setCurrentTheme(savedTheme);
          colorScheme.set(savedTheme);
        }
      } catch (error) {
        console.error('Error loading theme from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedTheme();
  }, []);

  // Save theme when changed
  useEffect(() => {
    if (!isLoading) {
      const saveTheme = async () => {
        try {
          await themeStorage.setTheme(currentTheme);
        } catch (error) {
          console.error('Error saving theme to storage:', error);
        }
      };

      saveTheme();
    }
  }, [currentTheme, isLoading]);

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
    <ThemeContext.Provider
      value={{ theme: currentTheme, toggleTheme, themeColors, isDark, isLoading }}>
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
