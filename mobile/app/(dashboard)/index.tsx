import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Users, Activity, Settings, Calendar, LogOut } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function MustahiqDashboard() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <ScrollView className="flex-1 px-6 pt-12 pb-6">
        
        {/* Header Section */}
        <View className="mb-10 flex-row justify-between items-center">
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 rounded-xl overflow-hidden shadow-sm">
              <Image source={require('../../assets/logo.png')} className="w-full h-full" resizeMode="cover" />
            </View>
            <View>
              <Text className="text-2xl font-extrabold text-slate-800 tracking-tight">e-Mubtadiaat</Text>
              <Text className="text-slate-500 font-medium text-xs mt-0.5">Portal Monitoring Pimpinan</Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={() => router.replace('/')}
            className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-100 active:scale-95 transition-transform"
          >
             <LogOut size={20} className="text-red-500" />
          </TouchableOpacity>
        </View>

        {/* Highlight Card: 3D Timbul / Soft Neumorphism Effect via Tailwind Box Shadow */}
        <View className="bg-white rounded-3xl p-6 mb-8 border border-slate-50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
           <Text className="text-slate-400 font-semibold mb-2 uppercase tracking-widest text-xs">Aktivitas Hari Ini</Text>
           <View className="flex-row items-end mb-4">
             <Text className="text-5xl font-black text-blue-900 tracking-tighter">1,248</Text>
             <Text className="text-slate-500 font-medium ml-2 mb-1">Santri Hadir</Text>
           </View>
           
           <View className="bg-blue-50/50 p-4 rounded-2xl flex-row justify-between items-center">
             <View className="flex-row items-center gap-3">
               <View className="w-2 h-2 rounded-full bg-blue-500" />
               <Text className="text-blue-900 font-bold">8 Kelas Aktif</Text>
             </View>
             <TouchableOpacity className="bg-white px-4 py-2 rounded-xl shadow-sm border border-blue-100 active:scale-95">
               <Text className="text-blue-700 font-bold text-xs">Lihat Detail</Text>
             </TouchableOpacity>
           </View>
        </View>

        {/* Menu Grid */}
        <View className="flex-row flex-wrap justify-between">
          <MenuButton 
            title="Absensi" 
            icon={Users} 
            color="text-indigo-600" 
            bg="bg-indigo-50" 
            onPress={() => router.push('/(dashboard)/attendance')}
          />
          <MenuButton title="Rekapitulasi" icon={Activity} color="text-emerald-600" bg="bg-emerald-50" />
          <MenuButton title="Jadwal" icon={Calendar} color="text-amber-600" bg="bg-amber-50" />
          <MenuButton title="Pengaturan" icon={Settings} color="text-slate-600" bg="bg-slate-100" />
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuButton({ title, icon: Icon, color, bg, onPress }: any) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="w-[47%] bg-white rounded-3xl p-6 mb-5 items-center justify-center border border-slate-50 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.04)] active:scale-95 transition-transform"
    >
      <View className={`w-14 h-14 rounded-2xl ${bg} items-center justify-center mb-4`}>
        <Icon size={24} className={color} strokeWidth={2.5} />
      </View>
      <Text className="text-slate-700 font-bold text-sm text-center">{title}</Text>
    </TouchableOpacity>
  );
}
