import { useAnimatedScrollHandler } from 'react-native-reanimated';
import { globalScrollY } from './globalScrollY';

// global scroll handler
export const useGlobalScrollHandler = () => {
  return useAnimatedScrollHandler({
    onScroll: (event) => {
      globalScrollY.value = event.contentOffset.y;
    },
  });
};
