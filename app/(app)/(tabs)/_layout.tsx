import { Tabs } from 'expo-router';
import { TabBar } from '@/components/tab-bar';
import { routeGuard } from '@/lib/guards/routeGuard';
import { paths } from '@/lib/utils/paths';

export default function TabsLayout() {
  const canAccessHome = routeGuard({ routeConfig: paths.app.home })();
  const canAccessProfile = routeGuard({ routeConfig: paths.app.profile })();
  const canAccessNews = routeGuard({ routeConfig: paths.app.news })();
  const canAccessSearch = routeGuard({ routeConfig: paths.app.search })();

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}>
      <Tabs.Protected guard={canAccessHome}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
          }}
        />
      </Tabs.Protected>

      <Tabs.Protected guard={canAccessProfile}>
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
          }}
        />
      </Tabs.Protected>

      <Tabs.Protected guard={canAccessNews}>
        <Tabs.Screen
          name="news"
          options={{
            title: 'News',
          }}
        />
      </Tabs.Protected>

      <Tabs.Protected guard={canAccessSearch}>
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
          }}
        />
      </Tabs.Protected>
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
