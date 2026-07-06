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

  const roleId = (sessionData?.user as any)?.role || 4;
  const isMonitoring = roleId === 2 || roleId === 3;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB', // Blue-600
        tabBarInactiveTintColor: '#94A3B8', // Slate-400
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          backgroundColor: '#FFFFFF',
          borderRadius: 30,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#94A3B8',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 4,
        },
        tabBarItemStyle: {
          borderRadius: 20,
          margin: 4,
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
      
      {/* KHUSUS MUSTAHIQ */}
      <Tabs.Screen
        name="presensi"
        options={{
          title: 'Absensi',
          href: isMonitoring ? null : '/(main)/presensi',
          tabBarIcon: ({ color }) => (
            <CalendarCheck color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="penilaian"
        options={{
          title: 'Input Nilai',
          href: isMonitoring ? null : '/(main)/penilaian',
          tabBarIcon: ({ color }) => (
            <FileSpreadsheet color={color} size={24} />
          ),
        }}
      />

      {/* KHUSUS MONITORING (MUFATISH / MUNDZIR) */}
      <Tabs.Screen
        name="finalisasi"
        options={{
          title: 'Finalisasi',
          href: !isMonitoring ? null : '/(main)/finalisasi',
          tabBarIcon: ({ color }) => (
            <FileSpreadsheet color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="rekap"
        options={{
          title: 'Laporan',
          href: !isMonitoring ? null : '/(main)/rekap',
          tabBarIcon: ({ color }) => (
            <Activity color={color} size={24} />
          ),
        }}
      />
      
      {/* Hide existing `nilai.tsx` if we replace it with `penilaian.tsx` */}
      <Tabs.Screen
        name="nilai"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
