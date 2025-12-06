import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          ...(Platform.OS === 'web' && {
            position: 'relative',
          }),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarLabel: 'Today',
        }}
      />
      <Tabs.Screen
        name="backlog"
        options={{
          title: 'Backlog',
          tabBarLabel: 'Backlog',
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarLabel: 'Journal',
        }}
      />
    </Tabs>
  );
}

