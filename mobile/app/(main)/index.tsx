import React from 'react';
import { View, Text, ScrollView, SafeAreaView, Platform, Dimensions, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { 
  Users, BookOpen, ClipboardList, Star,
  Book, Calendar, ArrowRight, User, Activity, AlertTriangle
} from 'lucide-react-native';
import { BouncingCard } from '../../../src/components/ui/BouncingCard';
import { getMobileDashboard } from '../../../src/services/api';
import { authClient } from '../../../src/lib/auth.client';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
// Calculate a responsive card width for the horizontal scroll
const cardWidth = isWeb ? 140 : width * 0.35;

export default function UnifiedDashboard() {
  const { data: sessionData, isPending: sessionPending } = authClient.useSession();
  const roleId = sessionData?.user?.role || 4; // default to 4 (Mustahiq)
  const isMonitoring = roleId === 2 || roleId === 3;

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', isMonitoring ? 'monitoring' : 'mustahiq'],
    queryFn: () => getMobileDashboard(isMonitoring ? 'monitoring' : 'mustahiq'),
    enabled: !!sessionData
  });

  if (sessionPending || isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#1E40AF" />
      </View>
    );
  }

  const summary = data?.data?.summary || { kelas: 0, jadwal: 0, tugas: 0, penilaian: 0 };
  const schedule = data?.data?.schedule || [];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        
        {/* HEADER SECTION (PREMIUM 3D STYLE) */}
        <View className="pt-12 pb-6 px-6 bg-white rounded-b-[40px] shadow-sm mb-6" style={{ elevation: 10, shadowColor: '#94A3B8', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 }}>
          <View className="mb-6">
            <Text className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-1">
              Portal Pengajar
            </Text>
            <Text className="text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Hidayatul Mubtadi'at
            </Text>
          </View>

          {/* User Profile Card (3D Glassy look) */}
          <View className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-3xl p-5 shadow-2xl flex-row items-center justify-between overflow-hidden" style={{ elevation: 15, shadowColor: '#1E40AF' }}>
            {/* Decorative background shapes */}
            <View className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <View className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-400/20 rounded-full blur-xl" />
            
            <View className="flex-row items-center flex-1 z-10">
              <View className="w-14 h-14 bg-white/20 rounded-full items-center justify-center mr-4 border border-white/30 backdrop-blur-md">
                <User color="#FFFFFF" size={28} />
              </View>
              <View>
                <Text className="text-blue-100 text-xs font-medium mb-1">Selamat Datang,</Text>
                <Text className="text-white font-bold text-lg" numberOfLines={1}>Ustadz / Ustadzah</Text>
              </View>
            </View>

            <View className="bg-white/20 rounded-2xl w-14 h-14 items-center justify-center border border-white/30 backdrop-blur-md z-10">
              <Text className="text-white text-[10px] font-bold uppercase mb-1">Hari Ini</Text>
              <Text className="text-white font-extrabold text-xl">{new Date().getDate()}</Text>
            </View>
          </View>
        </View>

        {/* SUMMARY SECTION */}
        <View className="mb-8">
          <View className="px-6 mb-4 flex-row items-center justify-between">
            <Text className="text-slate-800 font-bold text-xl tracking-tight">Ringkasan Info</Text>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 10, gap: 16 }}
            style={{ flexGrow: 0 }}
          >
            {[
              { title: 'Kelas', value: summary.kelas, icon: Users, color: '#3B82F6', bg: 'bg-blue-50' },
              { title: 'Jadwal', value: summary.jadwal, icon: BookOpen, color: '#10B981', bg: 'bg-emerald-50' },
              { title: 'Tugas', value: summary.tugas, icon: ClipboardList, color: '#F59E0B', bg: 'bg-amber-50' },
              { title: 'Penilaian', value: summary.penilaian, icon: Star, color: '#8B5CF6', bg: 'bg-purple-50' }
            ].map((item, index) => (
              <BouncingCard key={index} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 items-center justify-center" style={{ width: cardWidth, elevation: 5, shadowColor: '#64748B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 }}>
                <View className={`w-14 h-14 rounded-2xl ${item.bg} items-center justify-center mb-4`}>
                  <item.icon color={item.color} size={28} />
                </View>
                <Text className="text-slate-500 text-sm font-medium mb-1 text-center">{item.title}</Text>
                <Text className="text-slate-800 font-extrabold text-3xl">{item.value}</Text>
              </BouncingCard>
            ))}
          </ScrollView>
        </View>

        {/* SCHEDULE SECTION (ONLY FOR MUSTAHIQ) */}
        {!isMonitoring && (
          <View className="px-6 mb-8">
            <View className="flex-row justify-between items-end mb-4">
              <Text className="text-slate-800 font-bold text-xl tracking-tight">Jadwal Hari Ini</Text>
              <Text className="text-blue-600 text-sm font-bold">Lihat Semua</Text>
            </View>

            <View className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100" style={{ elevation: 8, shadowColor: '#64748B', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.05, shadowRadius: 15 }}>
              {schedule.length > 0 ? (
                schedule.map((item: any, index: number) => (
                  <View key={item.id} className="flex-row mb-6 last:mb-0 items-center">
                    <View className="w-16 items-center mr-3">
                      <Text className="text-slate-800 font-extrabold text-lg">{item.sesi}</Text>
                      <Text className="text-slate-400 text-xs font-medium uppercase tracking-wider mt-1">{item.hari}</Text>
                    </View>
                    
                    <View className="w-1.5 h-12 bg-blue-100 rounded-full mx-2 relative overflow-hidden">
                      <View className="w-full h-1/2 bg-blue-600 rounded-full absolute top-0" />
                    </View>

                    <View className="flex-1 ml-4 bg-slate-50 border border-slate-100 rounded-2xl p-4 flex-row items-center justify-between">
                      <View>
                        <Text className="text-slate-800 font-bold text-base mb-1">Kelas {item.kelasId}</Text>
                        <Text className="text-slate-500 text-xs font-medium">Kitab: {item.kitabId}</Text>
                      </View>
                      <View className="w-8 h-8 bg-white rounded-full items-center justify-center shadow-sm">
                        <ArrowRight color="#3B82F6" size={16} />
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <View className="items-center py-10">
                  <View className="w-20 h-20 bg-slate-50 rounded-full items-center justify-center mb-4">
                    <Calendar color="#94A3B8" size={32} />
                  </View>
                  <Text className="text-slate-800 font-bold text-lg">Waktu Luang!</Text>
                  <Text className="text-slate-400 font-medium mt-1 text-center">Tidak ada jadwal mengajar untuk hari ini.</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* QUICK ACCESS */}
        <View className="px-6">
          <Text className="text-slate-800 font-bold text-xl tracking-tight mb-4">Aksi Cepat</Text>
          
          <View className="flex-row flex-wrap justify-between" style={{ gap: 12 }}>
            {(!isMonitoring ? [
              { title: 'Presensi', icon: BookOpen, color: '#1E40AF', bg: 'bg-blue-50', link: '/(main)/presensi' },
              { title: 'Penilaian', icon: Star, color: '#8B5CF6', bg: 'bg-purple-50', link: '/(main)/nilai' },
              { title: 'Tugas', icon: ClipboardList, color: '#10B981', bg: 'bg-emerald-50', link: null },
              { title: 'Agenda', icon: Calendar, color: '#F59E0B', bg: 'bg-amber-50', link: null }
            ] : [
              { title: 'Rekap Presensi', icon: Activity, color: '#1E40AF', bg: 'bg-blue-50', link: '/(main)/rekap' },
              { title: 'Laporan Pelanggaran', icon: AlertTriangle, color: '#F43F5E', bg: 'bg-rose-50', link: null },
              { title: 'Jadwal Kelas', icon: Calendar, color: '#10B981', bg: 'bg-emerald-50', link: null },
              { title: 'Data Santri', icon: Users, color: '#8B5CF6', bg: 'bg-purple-50', link: null }
            ]).map((item, index) => {
              const CardContent = (
                <BouncingCard key={index} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 items-center justify-center w-[47%]" style={{ elevation: 5, shadowColor: '#64748B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, marginBottom: 12 }}>
                  <View className={`w-14 h-14 rounded-2xl ${item.bg} items-center justify-center mb-3`}>
                    <item.icon color={item.color} size={26} />
                  </View>
                  <Text className="text-slate-700 text-sm font-bold text-center">{item.title}</Text>
                </BouncingCard>
              );

              if (item.link) {
                return (
                  <Link key={index} href={item.link as any} asChild>
                    {CardContent}
                  </Link>
                );
              }
              
              return CardContent;
            })}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
