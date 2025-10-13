import React, { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { useTheme } from 'providers/ThemeProvider';
import Feather from '@expo/vector-icons/Feather';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export const ThemeToggle = React.memo(() => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const translateX = useSharedValue(isDark ? 46 : 3.5);

  useEffect(() => {
    translateX.value = withSpring(isDark ? 46 : 3.5, {
      damping: 15,
      stiffness: 150,
    });
  }, [isDark, translateX]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <Pressable
      onPress={toggleTheme}
      className="relative h-12 w-24 flex-row items-center justify-between rounded-full bg-primary p-1">
      <Icon icon="sun" />
      <Icon icon="moon" />
      <Animated.View
        style={[animatedStyle]}
        className="absolute flex h-10 w-10 flex-row items-center justify-center rounded-full bg-background"
      />
    </Pressable>
  );
});

ThemeToggle.displayName = 'ThemeToggle';

const Icon = (props: any) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View className="relative z-50 flex h-10 w-10 flex-row items-center justify-center rounded-full">
      <Feather name={props.icon} size={20} color={`${isDark ? 'white' : 'black'}`} />
    </View>
  );
};
