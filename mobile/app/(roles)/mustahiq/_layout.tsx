import { Tabs } from 'expo-router';
import { Home, CalendarCheck, FileSpreadsheet } from 'lucide-react-native';

export default function MustahiqLayout() {
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
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="presensi"
        options={{
          title: 'Kelas Saya',
          tabBarIcon: ({ color, size }) => (
            <CalendarCheck color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="nilai"
        options={{
          title: 'Tugas',
          tabBarIcon: ({ color, size }) => (
            <FileSpreadsheet color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          href: null, // Hide until implemented, or just show dummy icon
          tabBarIcon: ({ color, size }) => (
            <FileSpreadsheet color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
