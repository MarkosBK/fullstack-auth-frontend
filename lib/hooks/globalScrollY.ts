import { makeMutable } from 'react-native-reanimated';

// Глобальный SharedValue для скролла (создается вне React компонента)
export const globalScrollY = makeMutable(0);
