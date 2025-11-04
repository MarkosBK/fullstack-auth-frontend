import React from 'react';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/stores/theme.store';
import Animated, { useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';
import { globalScrollY } from '@/lib/hooks/globalScrollY';

interface StatusBarBluredProps {
  threshold?: number;
}

export const StatusBarBlured = React.memo(({ threshold = 50 }: StatusBarBluredProps) => {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(globalScrollY.value, [0, threshold], [0, 1], Extrapolate.CLAMP);

    return {
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: insets.top,
          zIndex: 1000,
        },
        animatedStyle,
      ]}>
      <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={{ flex: 1 }} />
    </Animated.View>
  );
});
