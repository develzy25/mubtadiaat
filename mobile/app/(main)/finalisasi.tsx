import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView, Dimensions, Platform } from 'react-native';
import { api } from '../../src/services/api';
import { ShieldCheck, AlertCircle, FileSpreadsheet } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function FinalisasiPage() {
  const [kelasList, setKelasList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/mobile/penilaian/status-kelas');
      if (res.data?.success) {
        setKelasList(res.data.data);
      } else {
        setError(res.data?.message || 'Gagal memuat status kelas');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan koneksi saat memuat data.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalisasi = async (classId: string) => {
    try {
      const res = await api.post(`/mobile/penilaian/finalisasi/${classId}`);
      if (res.data?.success) {
        alert('Kelas berhasil difinalisasi. Nilai Khos dan Nilai \'Am telah dikunci.');
        loadData(); // Reload list
      } else {
        alert(res.data?.message || 'Gagal melakukan finalisasi kelas.');
      }
    } catch (e) {
      console.error(e);
      alert('Terjadi kesalahan saat memproses finalisasi.');
    }
  };

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
      <View className="absolute top-[-10%] left-[-20%] w-[300px] h-[300px] bg-blue-300/20 rounded-full blur-[80px]" />
      
      <View style={[neumorphicShadow, { borderBottomLeftRadius: 32, borderBottomRightRadius: 32, borderTopWidth: 0 }]} className="bg-white px-6 pt-12 pb-6 z-10 border border-white">
        <Text className="text-emerald-600 font-extrabold text-xs uppercase tracking-widest mb-1">Mufatish & Mundzir</Text>
        <Text className="text-2xl font-black text-slate-800 tracking-tight">Finalisasi Kelas</Text>
        <Text className="text-slate-500 font-semibold mt-1">Kunci & Kalkulasi Nilai Otomatis</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Platform.OS === 'web' ? 140 : 120 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#10B981" className="mt-20" />
        ) : error ? (
          <View className="mt-20 items-center px-6">
             <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
                <AlertCircle color="#EF4444" size={32} />
             </View>
             <Text className="text-slate-800 font-bold text-center text-lg mb-2">Oops!</Text>
             <Text className="text-slate-500 text-center">{error}</Text>
          </View>
        ) : kelasList.length === 0 ? (
          <View className="mt-20 items-center px-6">
             <View className="w-16 h-16 bg-emerald-50 rounded-full items-center justify-center mb-4 border-2 border-white shadow-sm">
                <FileSpreadsheet color="#10B981" size={32} />
             </View>
             <Text className="text-slate-800 font-bold text-center text-lg mb-2">Belum Ada Kelas</Text>
             <Text className="text-slate-500 text-center">Data kelas belum tersedia atau belum ada yang siap difinalisasi.</Text>
          </View>
        ) : (
          <View>
            {kelasList.map((k) => (
              <View key={k.id} style={[neumorphicShadow, { borderRadius: 24, padding: 20, marginBottom: 16, borderCurve: 'continuous', borderWidth: 2, borderColor: '#FFFFFF' }]}>
                <View className="mb-4 flex-row justify-between items-center">
                  <View>
                    <Text className="text-slate-800 font-extrabold text-lg">{k.name}</Text>
                    <Text className="text-slate-400 font-medium text-xs mt-0.5">Wali: <Text className="text-slate-500 font-bold">{k.wali}</Text></Text>
                  </View>
                  <View className={`px-3 py-1 rounded-lg ${k.status === 'Draft' ? 'bg-amber-100' : k.status === 'Siap Finalisasi' ? 'bg-blue-100' : 'bg-emerald-100'}`}>
                    <Text className={`text-[10px] font-bold ${k.status === 'Draft' ? 'text-amber-700' : k.status === 'Siap Finalisasi' ? 'text-blue-700' : 'text-emerald-700'}`}>{k.status}</Text>
                  </View>
                </View>
                
                <View className="flex-row justify-between items-center mb-5">
                  <View>
                    <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Total Santri</Text>
                    <Text className="text-slate-800 font-black text-xl">{k.totalSantri}</Text>
                  </View>
                  <View>
                    <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Input Selesai</Text>
                    <Text className="text-slate-800 font-black text-xl">{k.progress}%</Text>
                  </View>
                </View>

                {k.status !== 'Final' ? (
                  <TouchableOpacity 
                    onPress={() => handleFinalisasi(k.id)}
                    className="bg-emerald-600 py-4 rounded-xl items-center flex-row justify-center"
                    style={{ elevation: 4, shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}>
                    <ShieldCheck color="white" size={20} style={{ marginRight: 8 }} />
                    <Text className="text-white font-black text-sm tracking-wider">FINALISASI KELAS</Text>
                  </TouchableOpacity>
                ) : (
                  <View className="bg-emerald-50 py-4 rounded-xl items-center flex-row justify-center border border-emerald-200">
                    <ShieldCheck color="#10B981" size={20} style={{ marginRight: 8 }} />
                    <Text className="text-emerald-700 font-black text-sm tracking-wider">SUDAH FINAL</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
