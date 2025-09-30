import { View } from 'react-native';
import { TabBarButton } from './TabBarButton';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from 'providers/ThemeProvider';

export const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { themeColors } = useTheme();

  return (
    <View className="absolute bottom-6 mx-5 flex-row items-center justify-between rounded-[64px] bg-background-700 py-2">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        if (['_sitemap', '+not-found'].includes(route.name)) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? themeColors['primary-500'] : themeColors['text-600']}
            label={label as string}
          />
        );
      })}
    </View>
  );
};
