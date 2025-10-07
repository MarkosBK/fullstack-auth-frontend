import { Platform } from 'react-native';
import { useKeyboardHandler } from 'react-native-keyboard-controller';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const PADDING_BOTTOM = Platform.OS === 'android' ? 0 : 0;

const useGradualAnimation = () => {
  const height = useSharedValue(PADDING_BOTTOM);

  useKeyboardHandler({
    onMove: (e) => {
      'worklet';
      height.value = Math.max(e.height, PADDING_BOTTOM);
    },
    onEnd: (e) => {
      'worklet';
      height.value = e.height;
    },
  });

  return {
    height,
  };
};

export default function FakeView() {
  const { height } = useGradualAnimation();

  const fakeView = useAnimatedStyle(() => {
    return {
      height: Math.abs(height.value),
      marginBottom: height.value > 0 ? 0 : PADDING_BOTTOM,
    };
  }, []);

  return <Animated.View style={fakeView} />;
}
