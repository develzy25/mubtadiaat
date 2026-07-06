import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView, Dimensions, Platform } from 'react-native';
import { api } from '../../src/services/api';
import { FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const KUARTAL_OPTIONS = [
  { id: 1, name: 'Kuartal 1', desc: 'Tamrin Smt I' },
  { id: 2, name: 'Kuartal 2', desc: 'Ujian Smt I' },
  { id: 3, name: 'Kuartal 3', desc: 'Tamrin Smt II' },
  { id: 4, name: 'Kuartal 4', desc: 'Ujian Smt II' }
];

const MAPEL_OPTIONS = [
  { id: '1', name: 'Nahwu' },
  { id: '2', name: 'Fiqih' },
  { id: '3', name: 'Tauhid' },
  { id: '4', name: "Al-Qur'an" }, // Max 8
  { id: '5', name: 'Akhlaq' } // Max 8
];

export default function PenilaianPage() {
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeKuartal, setActiveKuartal] = useState(1);
  const [activeMapel, setActiveMapel] = useState('1');
  const [activeClassId, setActiveClassId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [activeKuartal, activeMapel]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch active class for this Mustahiq
      const classRes = await api.get('/mobile/kelas');
      if (classRes.data?.success && classRes.data.data.length > 0) {
        const classId = classRes.data.data[0].id;
        setActiveClassId(classId);
        
        // In a real scenario, this endpoint should accept mapelId and kuartal as queries
        const res = await api.get(`/mobile/penilaian/kelas?classId=${classId}&mapel=${activeMapel}&kuartal=${activeKuartal}`);
        if (res.data?.success) {
          const initialized = res.data.data.map((s: any) => ({
            ...s,
            nilai: s.nilai?.toString() || ''
          }));
          setScores(initialized);
        } else {
          setError(res.data?.message || 'Gagal memuat daftar santri');
        }
      } else {
        setError('Tidak ada kelas yang aktif untuk Anda.');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan koneksi saat memuat data.');
    } finally {
      setLoading(false);
    }
  };

  const updateScore = (id: string, val: string) => {
    // Basic validation for max values
    const isSpecialMapel = MAPEL_OPTIONS.find(m => m.id === activeMapel)?.name === "Al-Qur'an" || 
                           MAPEL_OPTIONS.find(m => m.id === activeMapel)?.name === 'Akhlaq';
    const maxVal = isSpecialMapel ? 8 : 10;
    
    // Replace comma with dot for decimal
    let cleaned = val.replace(',', '.');
    
    if (cleaned !== '' && parseFloat(cleaned) > maxVal) {
      cleaned = maxVal.toString();
    }

    setScores(prev => prev.map(s => s.id === id ? { ...s, nilai: cleaned } : s));
  };

  const submitNilai = async () => {
    if (!activeClassId) return;
    
    try {
      const payload = {
        classId: activeClassId,
        mapelId: activeMapel,
        kuartal: activeKuartal,
        scores: scores.map(s => ({
          santri_id: s.id,
          nilai: parseFloat(s.nilai) || null
        }))
      };
      
      await api.post('/mobile/penilaian/input', payload);
      alert('Nilai Berhasil Disimpan!');
    } catch(e) {
      console.error(e);
      alert('Gagal menyimpan nilai. Periksa koneksi Anda.'); 
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
      
      <View style={[neumorphicShadow, { borderBottomLeftRadius: 32, borderBottomRightRadius: 32, borderTopWidth: 0 }]} className="bg-white pt-12 pb-4 z-10 border border-white">
        <View className="px-6 mb-4">
          <Text className="text-blue-600 font-extrabold text-xs uppercase tracking-widest mb-1">Input Nilai</Text>
          <Text className="text-2xl font-black text-slate-800 tracking-tight">Kuartal & Mata Pelajaran</Text>
        </View>

        {/* Kuartal Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6 mb-4" contentContainerStyle={{ paddingRight: 24, gap: 10 }}>
          {KUARTAL_OPTIONS.map(k => (
            <TouchableOpacity 
              key={k.id}
              onPress={() => setActiveKuartal(k.id)}
              className={`px-4 py-2 rounded-full border-2 ${activeKuartal === k.id ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-200'}`}
              style={activeKuartal === k.id ? { elevation: 4, shadowColor: '#2563EB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 } : {}}
            >
              <Text className={`font-bold ${activeKuartal === k.id ? 'text-white' : 'text-slate-600'}`}>{k.name}</Text>
              <Text className={`text-[9px] font-medium mt-0.5 ${activeKuartal === k.id ? 'text-blue-100' : 'text-slate-400'}`}>{k.desc}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Mapel Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6" contentContainerStyle={{ paddingRight: 24, gap: 10 }}>
          {MAPEL_OPTIONS.map(m => (
            <TouchableOpacity 
              key={m.id}
              onPress={() => setActiveMapel(m.id)}
              className={`px-4 py-2 rounded-2xl border-2 ${activeMapel === m.id ? 'bg-indigo-600 border-indigo-600' : 'bg-slate-50 border-slate-100'}`}
              style={activeMapel === m.id ? { elevation: 4, shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 } : {}}
            >
              <Text className={`font-bold text-sm ${activeMapel === m.id ? 'text-white' : 'text-slate-600'}`}>{m.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
        ) : scores.length === 0 ? (
          <View className="mt-20 items-center px-6">
             <View className="w-16 h-16 bg-blue-50 rounded-full items-center justify-center mb-4 border-2 border-white shadow-sm">
                <FileSpreadsheet color="#3B82F6" size={32} />
             </View>
             <Text className="text-slate-800 font-bold text-center text-lg mb-2">Belum Ada Data</Text>
             <Text className="text-slate-500 text-center">Data santri belum tersedia.</Text>
          </View>
        ) : (
          <View>
            <View className="flex-row justify-between px-2 mb-2">
               <Text className="text-slate-500 font-bold text-xs">NAMA SANTRI</Text>
               <Text className="text-slate-500 font-bold text-xs">NILAI KUARTAL {activeKuartal}</Text>
            </View>
            {scores.map((s) => (
              <View key={s.id} style={[neumorphicShadow, { borderRadius: 20, padding: 16, marginBottom: 12, borderCurve: 'continuous', borderWidth: 2, borderColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                <View className="flex-1 pr-4">
                  <Text className="text-slate-800 font-extrabold text-base">{s.name}</Text>
                  <Text className="text-slate-400 font-medium text-xs mt-0.5">Stambuk: <Text className="text-slate-500 font-bold">{s.noStambuk}</Text></Text>
                </View>
                
                <View className="w-24">
                  <TextInput
                    className="bg-[#F1F5F9] rounded-xl px-4 py-3 text-slate-800 font-black text-center shadow-sm text-lg"
                    keyboardType="decimal-pad"
                    value={s.nilai}
                    onChangeText={(val) => updateScore(s.id, val)}
                    placeholder="0.0"
                    placeholderTextColor="#94A3B8"
                    style={{ outlineStyle: 'none' } as any}
                  />
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Premium 3D Save Button */}
      {!loading && !error && scores.length > 0 && (
        <View className="absolute bottom-[90px] left-6 right-6">
          <TouchableOpacity 
            onPress={submitNilai}
            style={{ elevation: 12, shadowColor: '#2563EB', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16 }}
            className="bg-blue-600 h-16 rounded-[24px] items-center justify-center overflow-hidden flex-row">
            <View className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-t-[24px]" />
            <CheckCircle2 color="white" size={24} style={{ marginRight: 8 }} />
            <Text className="text-white font-black text-lg tracking-wider">SIMPAN NILAI</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
