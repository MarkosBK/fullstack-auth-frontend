import { Tabs } from 'expo-router';
import { TabBar } from '@/components/tab-bar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={({ route }) => ({
        headerShown: false,
      })}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />

      <Tabs.Screen
        name="news"
        options={{
          title: 'News',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
        }}
      />
      {/* <Tabs.Screen
        name="index"
        options={{
          tabBarButton: () => null,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarItemStyle: { display: 'none' },
        }}
      /> */}
    </Tabs>
  );
}
