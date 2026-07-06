import { Tabs } from 'expo-router';
import { LayoutDashboard, BarChart3 } from 'lucide-react-native';

export default function MonitoringLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#0f766e',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          paddingBottom: 4,
          paddingTop: 4,
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Monitoring',
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboard color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="rekap"
        options={{
          title: 'Rekap Data',
          tabBarIcon: ({ color, size }) => (
            <BarChart3 color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
