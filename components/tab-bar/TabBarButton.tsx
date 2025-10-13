import React, { useEffect } from 'react';
import { Pressable, PressableProps, View } from 'react-native';
import { icons } from './icons';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import { LabelSmall } from '../typography';
import { AppHaptics } from '@/lib/utils/haptics';

export const TabBarButton = React.memo(({
  isFocused,
  routeName,
  color,
  label,
  ...props
}: {
  isFocused: boolean;
  routeName: string;
  color: string;
  label: string;
} & PressableProps) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(typeof isFocused === 'boolean' ? (isFocused ? 1 : 0) : isFocused, {
      duration: 350,
    });
  }, [scale, isFocused]);

  const handlePress = (event: any) => {
    if (!isFocused) {
      AppHaptics.navigation();
    }
    if (props.onPress) {
      props.onPress(event);
    }
  };

  return (
    <Pressable
      {...props}
      onPress={handlePress}
      className="flex-1 items-center justify-center gap-1">
      <View>
        {icons[routeName as keyof typeof icons]({
          color,
        })}
      </View>

      <LabelSmall style={{ color }} className="font-medium">
        {label}
      </LabelSmall>
    </Pressable>
  );
});

TabBarButton.displayName = 'TabBarButton';

export default TabBarButton;
