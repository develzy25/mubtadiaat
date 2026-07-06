import React from 'react';
import { View, Text, ScrollView, SafeAreaView, Platform, Dimensions, ActivityIndicator, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { 
  Users, BookOpen, ClipboardList, Star,
  Book, Calendar, ArrowRight, CheckSquare, Clock, Activity
} from 'lucide-react-native';
import { authClient } from '../../src/lib/auth.client';
import { getMobileDashboard } from '../../src/services/api';
import { ThreeDCalendarIcon } from '../../src/components/ui/ThreeDCalendarIcon';

export default function UnifiedDashboard() {
  const { data: sessionData, isPending: sessionPending } = authClient.useSession();
  const roleId = (sessionData?.user as any)?.role || 4; // default to 4 (Mustahiq)
  const isMonitoring = roleId === 2 || roleId === 3;
  const userName = sessionData?.user?.name || "Ustadz/Ustadzah";

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', isMonitoring ? 'monitoring' : 'mustahiq'],
    queryFn: () => getMobileDashboard(isMonitoring ? 'monitoring' : 'mustahiq'),
    enabled: !!sessionData
  });

  if (sessionPending || isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F4F7FC]">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  // Neumorphic shadow style
  const neumorphicShadow = {
    elevation: 8,
    shadowColor: '#94A3B8',
    shadowOffset: { width: 4, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    backgroundColor: '#FFFFFF'
  };

  return (
    <View className="flex-1 bg-[#F4F7FC]" style={{ height: '100%' }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* HEADER SECTION */}
        <View className="px-6 pt-8 pb-6">
          <Text className="text-slate-800 text-base font-semibold tracking-wide">Pondok Pesantren</Text>
          <Text className="text-slate-900 text-3xl font-extrabold tracking-tight mt-1 leading-tight">Hidayatul Mubtadi'at</Text>
          <Text className="text-slate-900 text-3xl font-extrabold tracking-tight leading-tight">Lirboyo</Text>
          <Text className="text-slate-500 text-sm font-medium mt-2">Aplikasi Pengajar</Text>
        </View>

        {/* PROFILE CARD (3D NEUMORPHISM) */}
        <View className="px-6 mb-8">
          <View style={[neumorphicShadow, { borderRadius: 32 }]} className="p-6 flex-row items-center justify-between border border-white">
            
            <View className="flex-row items-center flex-1 pr-2">
              {/* Avatar (Placeholder since no real image is available) */}
              <View className="w-16 h-16 rounded-full bg-blue-100 items-center justify-center border-4 border-white shadow-sm overflow-hidden mr-4">
                <Image source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }} className="w-full h-full" resizeMode="cover" />
              </View>
              
              <View className="flex-1">
                <Text className="text-slate-500 text-xs font-medium mb-0.5">Assalamu'alaikum,</Text>
                <Text className="text-slate-800 text-lg font-extrabold">{userName}</Text>
                <Text className="text-slate-400 text-[10px] leading-tight mt-1 font-medium pr-4">Semoga hari ini penuh keberkahan dalam mengajar dan membimbing.</Text>
              </View>
            </View>

            {/* 3D Calendar Widget Placeholder */}
            <View className="items-center bg-slate-50 rounded-[20px] p-2 border border-slate-100 shadow-sm" style={{ elevation: 2 }}>
              <ThreeDCalendarIcon />
            </View>
          </View>
        </View>

        {/* RINGKASAN HARI INI */}
        <View className="px-6 mb-8">
          <Text className="text-slate-800 font-bold text-lg mb-4">Ringkasan Hari Ini</Text>
          <View className="flex-row justify-between">
            {isMonitoring ? (
              <>
                <View style={[neumorphicShadow, { borderRadius: 24, width: '23%', padding: 12, alignItems: 'center' }]}>
                  <View className="w-10 h-10 rounded-2xl bg-blue-50 items-center justify-center mb-2">
                    <BookOpen color="#3B82F6" size={20} />
                  </View>
                  <Text className="text-slate-500 text-[10px] font-medium text-center leading-tight h-6">Total Kelas</Text>
                  <Text className="text-slate-800 text-xl font-black mt-1">{data?.data?.summary?.totalKelas || 0}</Text>
                </View>
                <View style={[neumorphicShadow, { borderRadius: 24, width: '23%', padding: 12, alignItems: 'center' }]}>
                  <View className="w-10 h-10 rounded-2xl bg-emerald-50 items-center justify-center mb-2">
                    <Users color="#10B981" size={20} />
                  </View>
                  <Text className="text-slate-500 text-[10px] font-medium text-center leading-tight h-6">Total Santri</Text>
                  <Text className="text-slate-800 text-xl font-black mt-1">{data?.data?.summary?.totalSantri || 0}</Text>
                </View>
                <View style={[neumorphicShadow, { borderRadius: 24, width: '23%', padding: 12, alignItems: 'center' }]}>
                  <View className="w-10 h-10 rounded-2xl bg-amber-50 items-center justify-center mb-2">
                    <CheckSquare color="#F59E0B" size={20} />
                  </View>
                  <Text className="text-slate-500 text-[10px] font-medium text-center leading-tight h-6">Guru Aktif</Text>
                  <Text className="text-slate-800 text-xl font-black mt-1">{data?.data?.summary?.guruAktif || 0}</Text>
                </View>
                <View style={[neumorphicShadow, { borderRadius: 24, width: '23%', padding: 12, alignItems: 'center' }]}>
                  <View className="w-10 h-10 rounded-2xl bg-purple-50 items-center justify-center mb-2">
                    <Star color="#8B5CF6" size={20} />
                  </View>
                  <Text className="text-slate-500 text-[10px] font-medium text-center leading-tight h-6">Laporan</Text>
                  <Text className="text-slate-800 text-xl font-black mt-1">{data?.data?.summary?.laporan || 0}</Text>
                </View>
              </>
            ) : (
              <>
                <View style={[neumorphicShadow, { borderRadius: 24, width: '23%', padding: 12, alignItems: 'center' }]}>
                  <View className="w-10 h-10 rounded-2xl bg-blue-50 items-center justify-center mb-2">
                    <Users color="#3B82F6" size={20} />
                  </View>
                  <Text className="text-slate-500 text-[10px] font-medium text-center leading-tight h-6">Kelas Saya</Text>
                  <Text className="text-slate-800 text-xl font-black mt-1">{data?.data?.summary?.kelas || 0}</Text>
                </View>
                <View style={[neumorphicShadow, { borderRadius: 24, width: '23%', padding: 12, alignItems: 'center' }]}>
                  <View className="w-10 h-10 rounded-2xl bg-emerald-50 items-center justify-center mb-2">
                    <BookOpen color="#10B981" size={20} />
                  </View>
                  <Text className="text-slate-500 text-[10px] font-medium text-center leading-tight h-6">Jadwal Hari Ini</Text>
                  <Text className="text-slate-800 text-xl font-black mt-1">{data?.data?.summary?.jadwal || 0}</Text>
                </View>
                <View style={[neumorphicShadow, { borderRadius: 24, width: '23%', padding: 12, alignItems: 'center' }]}>
                  <View className="w-10 h-10 rounded-2xl bg-amber-50 items-center justify-center mb-2">
                    <CheckSquare color="#F59E0B" size={20} />
                  </View>
                  <Text className="text-slate-500 text-[10px] font-medium text-center leading-tight h-6">Tugas Dibuat</Text>
                  <Text className="text-slate-800 text-xl font-black mt-1">{data?.data?.summary?.tugas || 0}</Text>
                </View>
                <View style={[neumorphicShadow, { borderRadius: 24, width: '23%', padding: 12, alignItems: 'center' }]}>
                  <View className="w-10 h-10 rounded-2xl bg-purple-50 items-center justify-center mb-2">
                    <Star color="#8B5CF6" size={20} />
                  </View>
                  <Text className="text-slate-500 text-[10px] font-medium text-center leading-tight h-6">Penilaian</Text>
                  <Text className="text-slate-800 text-xl font-black mt-1">{data?.data?.summary?.penilaian || 0}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* JADWAL MENGAJAR & TUGAS (Hanya Mustahiq) */}
        {!isMonitoring && (
          <>
            <View className="px-6 mb-8">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-slate-800 font-bold text-lg">Jadwal Mengajar Hari Ini</Text>
                <Text className="text-blue-500 text-xs font-semibold">Lihat Semua {'>'}</Text>
              </View>

              <View style={[neumorphicShadow, { borderRadius: 28 }]} className="p-5">
                
                {/* Item 1 */}
                <View className="flex-row mb-6 relative">
                  <View className="w-14 items-center mr-2">
                    <Text className="text-slate-800 font-bold text-sm">07:30</Text>
                    <Text className="text-slate-400 text-xs font-medium">08:30</Text>
                  </View>
                  {/* Timeline Line */}
                  <View className="w-px h-full bg-slate-200 absolute left-[64px] top-4 -z-10" />
                  <View className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 ml-2 mr-4" />
                  
                  <View className="flex-1 flex-row">
                    <View className="w-12 h-12 bg-blue-500 rounded-2xl items-center justify-center shadow-sm shadow-blue-500/30 mr-3">
                      <BookOpen color="white" size={20} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-slate-800 font-extrabold text-sm mb-0.5">Kelas Tahsin</Text>
                      <Text className="text-blue-600 text-xs font-bold mb-1">Kelas A</Text>
                      <Text className="text-slate-400 text-[10px] font-medium">Materi: Makharijul Huruf</Text>
                    </View>
                    <View className="bg-emerald-50 px-2 py-1 h-6 rounded-lg self-start">
                      <Text className="text-emerald-600 text-[9px] font-bold">Sedang Berlangsung</Text>
                    </View>
                  </View>
                </View>

                {/* Item 2 */}
                <View className="flex-row mb-6 relative">
                  <View className="w-14 items-center mr-2">
                    <Text className="text-slate-800 font-bold text-sm">09:00</Text>
                    <Text className="text-slate-400 text-xs font-medium">10:00</Text>
                  </View>
                  {/* Timeline Line */}
                  <View className="w-px h-full bg-slate-200 absolute left-[64px] top-4 -z-10" />
                  <View className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 ml-2 mr-4" />
                  
                  <View className="flex-1 flex-row">
                    <View className="w-12 h-12 bg-blue-500 rounded-2xl items-center justify-center shadow-sm shadow-blue-500/30 mr-3">
                      <ClipboardList color="white" size={20} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-slate-800 font-extrabold text-sm mb-0.5">Fiqih Dasar</Text>
                      <Text className="text-blue-600 text-xs font-bold mb-1">Kelas B</Text>
                      <Text className="text-slate-400 text-[10px] font-medium">Materi: Thaharah</Text>
                    </View>
                    <View className="px-2 py-1 h-6 self-start">
                      <Text className="text-blue-500 text-[10px] font-bold">Akan Datang</Text>
                    </View>
                  </View>
                </View>
                
              </View>
            </View>

            {/* TUGAS YANG PERLU DIPERIKSA */}
            <View className="px-6 mb-8">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-slate-800 font-bold text-lg">Tugas yang Perlu Diperiksa</Text>
                <Text className="text-blue-500 text-xs font-semibold">Lihat Semua {'>'}</Text>
              </View>
              <View style={[neumorphicShadow, { borderRadius: 24 }]} className="p-4 flex-row items-center">
                <View className="w-12 h-12 bg-amber-100 rounded-xl items-center justify-center mr-4">
                  <ClipboardList color="#F59E0B" size={24} />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-800 font-bold text-sm">2 tugas menunggu pemeriksaan</Text>
                  <Text className="text-slate-400 text-[10px] font-medium mt-0.5">Terakhir diterima: 14 Mei 2025</Text>
                </View>
                <ArrowRight color="#94A3B8" size={16} />
              </View>
            </View>
          </>
        )}

        {/* AKSES CEPAT */}
        <View className="px-6">
          <Text className="text-slate-800 font-bold text-lg mb-4">Akses Cepat</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 24, gap: 12 }}>
            {(isMonitoring ? [
              { title: 'Rekap Presensi', icon: Activity, color: '#3B82F6', bg: 'bg-blue-50', link: '/(main)/rekap' },
              { title: 'Laporan Kelas', icon: BookOpen, color: '#8B5CF6', bg: 'bg-purple-50', link: null },
              { title: 'Data Asatidz', icon: Users, color: '#10B981', bg: 'bg-emerald-50', link: null },
              { title: 'Jadwal Pesantren', icon: Calendar, color: '#F59E0B', bg: 'bg-amber-50', link: null }
            ] : [
              { title: 'Kelas Saya', icon: Users, color: '#3B82F6', bg: 'bg-blue-50', link: '/(main)/presensi' },
              { title: 'Tugas', icon: ClipboardList, color: '#8B5CF6', bg: 'bg-purple-50', link: '/(main)/nilai' },
              { title: 'Penilaian', icon: Star, color: '#10B981', bg: 'bg-emerald-50', link: null },
              { title: 'Jadwal Saya', icon: Calendar, color: '#F59E0B', bg: 'bg-amber-50', link: null }
            ]).map((item, index) => {
              const Card = (
                <View key={index} style={{ ...neumorphicShadow, borderRadius: 24, width: 85, padding: 12, alignItems: 'center', marginBottom: 10 }}>
                  <View className={`w-12 h-12 rounded-2xl ${item.bg} items-center justify-center mb-2 shadow-sm border border-white`}>
                    <item.icon color={item.color} size={24} />
                  </View>
                  <Text className="text-slate-600 text-[10px] font-bold text-center leading-tight">{item.title}</Text>
                </View>
              );

              if (item.link) {
                return (
                  <Link key={index} href={item.link as any} asChild>
                    {Card}
                  </Link>
                );
              }
              return Card;
            })}
          </ScrollView>
        </View>

      </ScrollView>
    </View>
  );
}
