import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, SafeAreaView, Dimensions, ScrollView, Platform } from 'react-native';
import { api } from '../../src/services/api';
import { Activity, Check, X, AlertCircle, Clock } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function RekapPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get('/mobile/rekap/presensi');
        if (res.data?.success) {
          setData(res.data.data);
        } else {
          setError(res.data?.message || 'Gagal memuat rekap');
        }
      } catch (err) {
        console.error(err);
        setError('Terjadi kesalahan koneksi saat memuat data rekap.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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
    <SafeAreaView className="flex-1 bg-[#F4F7FC]">
      {/* 3D Glassmorphism Abstract Background */}
      <View className="absolute top-[-10%] left-[-20%] w-[300px] h-[300px] bg-blue-300/20 rounded-full blur-[80px]" />
      <View className="absolute bottom-[-10%] right-[-20%] w-[350px] h-[350px] bg-indigo-300/20 rounded-full blur-[100px]" />
      
      {/* Premium Header */}
      <View style={[neumorphicShadow, { borderBottomLeftRadius: 32, borderBottomRightRadius: 32, borderTopWidth: 0 }]} className="bg-white px-6 pt-12 pb-6 z-10 border border-white">
        <Text className="text-blue-600 font-extrabold text-xs uppercase tracking-widest mb-1">Laporan Mufatish</Text>
        <Text className="text-2xl font-black text-slate-800 tracking-tight">Rekap Presensi</Text>
        <Text className="text-slate-500 font-semibold mt-1">Bulan Ini</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Platform.OS === 'web' ? 140 : 120 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#2563EB" className="mt-20" />
        ) : error ? (
          <View className="mt-20 items-center px-6">
             <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
                <AlertCircle color="#EF4444" size={32} />
             </View>
             <Text className="text-slate-800 font-bold text-center text-lg mb-2">Oops!</Text>
             <Text className="text-slate-500 text-center">{error}</Text>
          </View>
        ) : !data ? (
          <View className="mt-20 items-center px-6">
             <View className="w-16 h-16 bg-blue-50 rounded-full items-center justify-center mb-4 border-2 border-white shadow-sm">
                <Activity color="#3B82F6" size={32} />
             </View>
             <Text className="text-slate-800 font-bold text-center text-lg mb-2">Belum Ada Rekap</Text>
             <Text className="text-slate-500 text-center">Data rekap presensi belum tersedia.</Text>
          </View>
        ) : (
          <View className="px-2">
            <View className="flex-row justify-between mb-4">
              <View style={[neumorphicShadow, { borderRadius: 24, width: '48%', padding: 20, alignItems: 'center', borderCurve: 'continuous' }]}>
                <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mb-3">
                  <Check color="#2563EB" size={24} />
                </View>
                <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Hadir</Text>
                <Text className="text-slate-800 text-3xl font-black">{data.totalHadir}</Text>
              </View>

              <View style={[neumorphicShadow, { borderRadius: 24, width: '48%', padding: 20, alignItems: 'center', borderCurve: 'continuous' }]}>
                <View className="w-12 h-12 rounded-full bg-indigo-50 items-center justify-center mb-3">
                  <Clock color="#4F46E5" size={24} />
                </View>
                <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Izin</Text>
                <Text className="text-slate-800 text-3xl font-black">{data.totalIzin}</Text>
              </View>
            </View>

            <View className="flex-row justify-between mb-4">
              <View style={[neumorphicShadow, { borderRadius: 24, width: '48%', padding: 20, alignItems: 'center', borderCurve: 'continuous' }]}>
                <View className="w-12 h-12 rounded-full bg-amber-50 items-center justify-center mb-3">
                  <AlertCircle color="#F59E0B" size={24} />
                </View>
                <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Sakit</Text>
                <Text className="text-slate-800 text-3xl font-black">{data.totalSakit}</Text>
              </View>

              <View style={[neumorphicShadow, { borderRadius: 24, width: '48%', padding: 20, alignItems: 'center', borderCurve: 'continuous' }]}>
                <View className="w-12 h-12 rounded-full bg-red-50 items-center justify-center mb-3">
                  <X color="#EF4444" size={24} />
                </View>
                <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Alpha</Text>
                <Text className="text-slate-800 text-3xl font-black">{data.totalAlpha}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
