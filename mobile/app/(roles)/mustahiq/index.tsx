import React from 'react';
import { View, Text, ScrollView, SafeAreaView, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { 
  Users, BookOpen, ClipboardList, Star,
  Book, PenTool, Layout, Calendar
} from 'lucide-react-native';
import { BouncingCard } from '../../../src/components/ui/BouncingCard';
import { getMobileDashboard } from '../../../src/services/api';

export default function MustahiqDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', 'mustahiq'],
    queryFn: () => getMobileDashboard('mustahiq')
  });

  const summary = data?.data?.summary || {
    kelas: 0,
    jadwal: 0,
    tugas: 0,
    penilaian: 0
  };

  const schedule = data?.data?.schedule || [];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        
        {/* HEADER SECTION */}
        <View className="bg-gradient-to-b from-blue-50/50 to-background pt-12 pb-8 px-6">
          <View className="mb-8">
            <Text className="text-primary font-bold text-xs uppercase tracking-widest mb-2">
              Pondok Pesantren
            </Text>
            <Text className="text-[28px] font-extrabold text-slate-800 leading-tight">
              Hidayatul Mubtadi'at{'\n'}Lirboyo
            </Text>
            <Text className="text-slate-500 font-medium mt-2">Aplikasi Pengajar</Text>
          </View>

          <View className="bg-surface rounded-[28px] p-5 shadow-soft flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="w-14 h-14 bg-blue-50 rounded-full items-center justify-center mr-4 border border-blue-100 overflow-hidden">
                <Image source={require('../../../assets/logo.png')} className="w-full h-full" resizeMode="cover" />
              </View>
              <View>
                <Text className="text-slate-500 text-xs font-medium">Assalamu'alaikum,</Text>
                <Text className="text-slate-800 font-bold text-lg">Ustadz / Ustadzah</Text>
              </View>
            </View>

            <View className="bg-blue-50 rounded-2xl w-16 h-16 items-center justify-center border border-blue-100/50">
              <View className="bg-primary w-full rounded-t-xl py-1 items-center justify-center absolute top-0">
                <Text className="text-white text-[10px] font-bold">Hari Ini</Text>
              </View>
              <Text className="text-primary font-bold text-xl mt-3">{new Date().getDate()}</Text>
            </View>
          </View>
        </View>

        {/* SUMMARY SECTION */}
        <View className="px-6 mb-10">
          <Text className="text-slate-800 font-bold text-lg mb-4">Ringkasan Hari Ini</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2 px-2">
            
            <BouncingCard className="bg-surface rounded-3xl p-5 w-32 mr-4 shadow-soft items-center">
              <View className="w-12 h-12 rounded-2xl bg-blue-50 items-center justify-center mb-4">
                <Users color="#1E40AF" size={24} />
              </View>
              <Text className="text-slate-500 text-xs font-medium mb-1 text-center">Kelas Saya</Text>
              <Text className="text-slate-800 font-bold text-2xl">{summary.kelas}</Text>
            </BouncingCard>

            <BouncingCard className="bg-surface rounded-3xl p-5 w-32 mr-4 shadow-soft items-center">
              <View className="w-12 h-12 rounded-2xl bg-emerald-50 items-center justify-center mb-4">
                <BookOpen color="#10B981" size={24} />
              </View>
              <Text className="text-slate-500 text-xs font-medium mb-1 text-center">Jadwal</Text>
              <Text className="text-slate-800 font-bold text-2xl">{summary.jadwal}</Text>
            </BouncingCard>

            <BouncingCard className="bg-surface rounded-3xl p-5 w-32 mr-4 shadow-soft items-center">
              <View className="w-12 h-12 rounded-2xl bg-amber-50 items-center justify-center mb-4">
                <ClipboardList color="#F59E0B" size={24} />
              </View>
              <Text className="text-slate-500 text-xs font-medium mb-1 text-center">Tugas</Text>
              <Text className="text-slate-800 font-bold text-2xl">{summary.tugas}</Text>
            </BouncingCard>

            <BouncingCard className="bg-surface rounded-3xl p-5 w-32 mr-4 shadow-soft items-center">
              <View className="w-12 h-12 rounded-2xl bg-purple-50 items-center justify-center mb-4">
                <Star color="#8B5CF6" size={24} />
              </View>
              <Text className="text-slate-500 text-xs font-medium mb-1 text-center">Penilaian</Text>
              <Text className="text-slate-800 font-bold text-2xl">{summary.penilaian}</Text>
            </BouncingCard>

          </ScrollView>
        </View>

        {/* SCHEDULE SECTION */}
        <View className="px-6 mb-10">
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-slate-800 font-bold text-lg">Jadwal Mengajar</Text>
            <Text className="text-primary text-sm font-medium">Lihat Semua</Text>
          </View>

          <View className="bg-surface rounded-[28px] p-6 shadow-soft">
            {schedule.length > 0 ? (
              schedule.map((item: any, index: number) => (
                <View key={item.id} className="flex-row mb-6 last:mb-0">
                  <View className="w-16 items-center mr-2 pt-2">
                    <Text className="text-slate-800 font-bold">{item.sesi}</Text>
                    <Text className="text-slate-400 text-xs mt-1">Hari {item.hari}</Text>
                  </View>
                  
                  <View className="w-px bg-slate-100 mx-2 relative items-center justify-center">
                    <View className="w-2 h-2 rounded-full bg-primary absolute" />
                  </View>

                  <View className="flex-1 ml-4 bg-background rounded-2xl p-4 flex-row items-center">
                    <View className="w-10 h-10 bg-white rounded-xl items-center justify-center mr-4 shadow-sm">
                      <Book color="#1E40AF" size={20} />
                    </View>
                    <View>
                      <Text className="text-slate-800 font-bold">Kelas {item.kelasId}</Text>
                      <Text className="text-slate-500 text-xs mt-1">Kitab: {item.kitabId}</Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View className="items-center py-8">
                <Calendar color="#94A3B8" size={32} />
                <Text className="text-slate-400 font-medium mt-3">Tidak ada jadwal hari ini</Text>
              </View>
            )}
          </View>
        </View>

        {/* QUICK ACCESS */}
        <View className="px-6 mb-12">
          <Text className="text-slate-800 font-bold text-lg mb-5">Akses Cepat</Text>
          <View className="flex-row justify-between">
            
            <Link href="/(roles)/mustahiq/presensi" asChild>
              <BouncingCard className="items-center w-1/4">
                <View className="w-16 h-16 bg-surface rounded-2xl items-center justify-center shadow-soft mb-3">
                  <View className="w-12 h-12 bg-blue-50 rounded-xl items-center justify-center">
                    <BookOpen color="#1E40AF" size={24} />
                  </View>
                </View>
                <Text className="text-slate-600 text-xs font-semibold text-center">Presensi</Text>
              </BouncingCard>
            </Link>

            <Link href="/(roles)/mustahiq/nilai" asChild>
              <BouncingCard className="items-center w-1/4">
                <View className="w-16 h-16 bg-surface rounded-2xl items-center justify-center shadow-soft mb-3">
                  <View className="w-12 h-12 bg-purple-50 rounded-xl items-center justify-center">
                    <Star color="#8B5CF6" size={24} />
                  </View>
                </View>
                <Text className="text-slate-600 text-xs font-semibold text-center">Penilaian</Text>
              </BouncingCard>
            </Link>

            <BouncingCard className="items-center w-1/4">
              <View className="w-16 h-16 bg-surface rounded-2xl items-center justify-center shadow-soft mb-3">
                <View className="w-12 h-12 bg-emerald-50 rounded-xl items-center justify-center">
                  <ClipboardList color="#10B981" size={24} />
                </View>
              </View>
              <Text className="text-slate-600 text-xs font-semibold text-center">Tugas</Text>
            </BouncingCard>

            <BouncingCard className="items-center w-1/4">
              <View className="w-16 h-16 bg-surface rounded-2xl items-center justify-center shadow-soft mb-3">
                <View className="w-12 h-12 bg-amber-50 rounded-xl items-center justify-center">
                  <Calendar color="#F59E0B" size={24} />
                </View>
              </View>
              <Text className="text-slate-600 text-xs font-semibold text-center">Agenda</Text>
            </BouncingCard>
            
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
