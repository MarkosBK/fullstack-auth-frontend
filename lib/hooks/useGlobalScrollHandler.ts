import { useAnimatedScrollHandler } from 'react-native-reanimated';
import { globalScrollY } from './globalScrollY';

// Глобальный обработчик скролла
export const useGlobalScrollHandler = () => {
  return useAnimatedScrollHandler({
    onScroll: (event) => {
      globalScrollY.value = event.contentOffset.y;
    },
  });
};
