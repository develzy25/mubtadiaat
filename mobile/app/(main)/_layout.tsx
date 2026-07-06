import { Tabs } from 'expo-router';
import { Home, CalendarCheck, FileSpreadsheet, Activity } from 'lucide-react-native';
import { authClient } from '../../src/lib/auth.client';
import { View, ActivityIndicator } from 'react-native';

export default function UnifiedLayout() {
  const { data: sessionData, isPending } = authClient.useSession();
  
  if (isPending) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  const roleId = sessionData?.user?.role || 4;
  const isMonitoring = roleId === 2 || roleId === 3;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB', // Blue-600
        tabBarInactiveTintColor: '#94A3B8', // Slate-400
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color }) => (
            <Home color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="presensi"
        options={{
          title: 'Kelas Saya',
          href: isMonitoring ? null : '/(main)/presensi', // Hide for monitoring
          tabBarIcon: ({ color }) => (
            <CalendarCheck color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="nilai"
        options={{
          title: 'Tugas',
          href: isMonitoring ? null : '/(main)/nilai', // Hide for monitoring
          tabBarIcon: ({ color }) => (
            <FileSpreadsheet color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="rekap"
        options={{
          title: 'Rekap Presensi',
          href: !isMonitoring ? null : '/(main)/rekap', // Hide for mustahiq
          tabBarIcon: ({ color }) => (
            <Activity color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
