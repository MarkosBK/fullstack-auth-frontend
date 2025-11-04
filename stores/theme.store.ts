import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMemo } from 'react';
import { colorScheme } from 'nativewind';
import { colors } from '@/styles/colors';
import { STORAGE_KEYS } from '@/lib/utils/storage';

export type Theme = 'light' | 'dark';

interface ThemeStoreState {
  theme: Theme;
}

interface ThemeStoreActions {
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

type ThemeStore = ThemeStoreState & ThemeStoreActions;

export const themeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'light',

      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        colorScheme.set(newTheme);
      },

      setTheme: (theme: Theme) => {
        set({ theme });
        colorScheme.set(theme);
      },
    }),
    {
      name: STORAGE_KEYS.THEME,
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error('Theme rehydration error:', error);
          } else if (state) {
            colorScheme.set(state.theme);
          }
        };
      },
    }
  )
);

// Computed values and selectors
export const useTheme = () => {
  const theme = themeStore((state) => state.theme);
  const toggleTheme = themeStore((state) => state.toggleTheme);
  const setTheme = themeStore((state) => state.setTheme);
  const hasHydrated = themeStore.persist.hasHydrated();

  // Process colors to RGB format (memoized for performance)
  const themeColors = useMemo(() => {
    const processedColors: Record<string, string> = {};
    const colorsRes = colors[theme];

    Object.entries(colorsRes).forEach(([color, value]) => {
      processedColors[color] = `rgb(${value})`;
    });

    return processedColors;
  }, [theme]);

  const isDark = useMemo(() => theme === 'dark', [theme]);

  return {
    theme,
    toggleTheme,
    setTheme,
    themeColors,
    isDark,
    isLoading: !hasHydrated,
  };
};
