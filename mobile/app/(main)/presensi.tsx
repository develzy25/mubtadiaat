import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView, Dimensions, Platform, TextInput } from 'react-native';
import { api } from '../../src/services/api';
import { AlertCircle, FileSpreadsheet } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function PresensiPage() {
  const [santriList, setSantriList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeClassId, setActiveClassId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const classRes = await api.get('/mobile/kelas');
        if (classRes.data?.success && classRes.data.data.length > 0) {
          const classId = classRes.data.data[0].id;
          setActiveClassId(classId);
          
          const res = await api.get(`/mobile/presensi/${classId}`);
          if (res.data?.success) {
            // Initialize with text inputs for recap (Izin & Alpha)
            const initialized = res.data.data.map((s: any) => ({
              ...s,
              izin: s.izin?.toString() || '',
              alpha: s.alpha?.toString() || ''
            }));
            setSantriList(initialized);
          } else {
            setError(res.data?.message || 'Gagal memuat presensi');
          }
        } else {
           setError('Tidak ada kelas yang aktif untuk Anda.');
        }
      } catch (err) {
        console.error(err);
        setError('Terjadi kesalahan koneksi saat memuat data presensi.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleInput = (santriId: string, field: 'izin' | 'alpha', value: string) => {
    setSantriList(prev => prev.map(s => {
      if (s.id === santriId) {
        return {
          ...s,
          [field]: value,
        };
      }
      return s;
    }));
  };

  const submitPresensi = async () => {
    if (!activeClassId) {
      alert('Tidak ada kelas yang aktif');
      return;
    }
    
    try {
      const payload = santriList.map(s => ({
        santri_id: s.id,
        izin: parseInt(s.izin) || 0,
        alpha: parseInt(s.alpha) || 0
      }));
      await api.post(`/mobile/presensi/${activeClassId}`, payload);
      alert('Rekap Absensi Berhasil Disimpan!');
    } catch(e) {
      console.error(e);
      alert('Gagal menyimpan rekap absensi. Periksa koneksi Anda.'); 
    }
  };

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
      
      {/* Premium Header */}
      <View style={[neumorphicShadow, { borderBottomLeftRadius: 32, borderBottomRightRadius: 32, borderTopWidth: 0 }]} className="bg-white px-6 pt-12 pb-6 z-10 border border-white">
        <Text className="text-blue-600 font-extrabold text-xs uppercase tracking-widest mb-1">Manajemen Kelas</Text>
        <Text className="text-2xl font-black text-slate-800 tracking-tight">Rekap Absensi</Text>
        <Text className="text-slate-500 font-semibold mt-1">Input jumlah Izin & Alpha per Semester</Text>
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
        ) : santriList.length === 0 ? (
          <View className="mt-20 items-center px-6">
             <View className="w-16 h-16 bg-blue-50 rounded-full items-center justify-center mb-4 border-2 border-white shadow-sm">
                <FileSpreadsheet color="#3B82F6" size={32} />
             </View>
             <Text className="text-slate-800 font-bold text-center text-lg mb-2">Belum Ada Santri</Text>
             <Text className="text-slate-500 text-center font-medium">Belum ada data santri di kelas ini.</Text>
          </View>
        ) : (
          <View>
            {santriList.map((santri) => (
              <View key={santri.id} style={[neumorphicShadow, { borderRadius: 24, padding: 20, marginBottom: 16, borderCurve: 'continuous', borderWidth: 2, borderColor: '#FFFFFF' }]}>
                <View className="mb-5 flex-row justify-between items-center">
                  <View>
                    <Text className="text-slate-800 font-extrabold text-lg">{santri.name}</Text>
                    <Text className="text-slate-400 font-medium text-xs mt-0.5">Stambuk: <Text className="text-slate-500 font-bold">{santri.noStambuk}</Text></Text>
                  </View>
                </View>
                
                <View className="flex-row justify-between">
                  <View className="flex-1 mr-2">
                     <Text className="text-slate-500 font-extrabold text-[10px] uppercase tracking-wider mb-2 ml-1">Total Izin (Hari)</Text>
                     <TextInput
                       className="bg-[#F1F5F9] rounded-2xl px-4 py-3 text-slate-800 font-bold shadow-sm"
                       keyboardType="number-pad"
                       value={santri.izin}
                       onChangeText={(val) => handleInput(santri.id, 'izin', val)}
                       placeholder="0"
                       placeholderTextColor="#94A3B8"
                       style={{ outlineStyle: 'none' } as any}
                     />
                  </View>
                  <View className="flex-1 ml-2">
                     <Text className="text-slate-500 font-extrabold text-[10px] uppercase tracking-wider mb-2 ml-1">Total Alpha (Hari)</Text>
                     <TextInput
                       className="bg-[#F1F5F9] rounded-2xl px-4 py-3 text-slate-800 font-bold shadow-sm"
                       keyboardType="number-pad"
                       value={santri.alpha}
                       onChangeText={(val) => handleInput(santri.id, 'alpha', val)}
                       placeholder="0"
                       placeholderTextColor="#94A3B8"
                       style={{ outlineStyle: 'none' } as any}
                     />
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Premium 3D Save Button */}
      {!loading && !error && santriList.length > 0 && (
        <View className="absolute bottom-[90px] left-6 right-6">
          <TouchableOpacity 
            onPress={submitPresensi}
            style={{ elevation: 12, shadowColor: '#2563EB', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16 }}
            className="bg-blue-600 h-16 rounded-[24px] items-center justify-center overflow-hidden">
            <View className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-t-[24px]" />
            <Text className="text-white font-black text-lg tracking-wider">SIMPAN ABSENSI</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
