import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Save, Calendar, CheckCircle, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { db, offlineQueue } from '../../src/lib/db';
import { api } from '../../src/services/api';
export default function AttendanceScreen() {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [isLoading, setIsLoading] = useState(false);

  const [dummySantri, setDummySantri] = useState([
    { id: '1', name: 'Ahmad Faiz', hadir: 20, sakit: 1, izin: 0, alpha: 0 },
    { id: '2', name: 'Budi Santoso', hadir: 21, sakit: 0, izin: 0, alpha: 0 },
    { id: '3', name: 'Cahyo Guntur', hadir: 19, sakit: 1, izin: 1, alpha: 0 },
  ]);

  const handleSave = async () => {
    setIsLoading(true);
    
    // Attempt API Request, fallback to SQLite
    try {
      // Real API sync
      await api.post('/santri/attendance/sync', { month: selectedMonth, data: dummySantri });
      Alert.alert(
        "Berhasil", 
        "Data absensi telah berhasil disimpan.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (e) {
      // Offline fallback: Save to SQLite
      await db.insert(offlineQueue).values({
        action: 'SYNC_ATTENDANCE',
        payload: JSON.stringify({ month: selectedMonth, data: dummySantri }),
        status: 'PENDING',
        createdAt: new Date().toISOString()
      });

      Alert.alert(
        "Tersimpan Offline", 
        "Koneksi internet tidak tersedia. Data absensi telah disimpan di perangkat dan akan disinkronkan otomatis.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    }
    
    setIsLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <View className="h-16 flex-row items-center justify-between px-6 border-b border-slate-100 bg-white">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
           <ArrowLeft size={24} className="text-slate-600" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-slate-800">Rekap Absensi</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-6 pt-6 pb-24">
        <View className="flex-row items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)] mb-6">
          <View className="flex-row items-center gap-3">
             <Calendar size={20} className="text-blue-600" />
             <Text className="font-bold text-slate-700">Periode</Text>
          </View>
          <Text className="font-bold text-blue-900 bg-blue-50 px-3 py-1 rounded-lg">{selectedMonth}</Text>
        </View>

        {dummySantri.map((santri) => (
          <View key={santri.id} className="bg-white p-5 rounded-3xl mb-4 border border-slate-50 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)]">
            <Text className="font-bold text-slate-800 text-lg mb-3">{santri.name}</Text>
            
            <View className="flex-row justify-between">
              <StatBox label="Hadir" value={santri.hadir} color="text-green-600" bg="bg-green-50" />
              <StatBox label="Sakit" value={santri.sakit} color="text-amber-600" bg="bg-amber-50" />
              <StatBox label="Izin" value={santri.izin} color="text-blue-600" bg="bg-blue-50" />
              <StatBox label="Alpha" value={santri.alpha} color="text-red-600" bg="bg-red-50" />
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Floating Save Button */}
      <View className="absolute bottom-6 left-6 right-6">
        <TouchableOpacity 
          onPress={handleSave}
          disabled={isLoading}
          className="bg-blue-800 h-16 rounded-3xl flex-row items-center justify-center shadow-xl shadow-blue-900/30 active:scale-95 transition-transform"
        >
          <Save size={24} className="text-white mr-3" />
          <Text className="text-white font-bold text-lg">Simpan Rekap</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function StatBox({ label, value, color, bg }: any) {
  return (
    <View className={`items-center justify-center w-[22%] py-3 rounded-2xl ${bg}`}>
      <Text className={`font-black text-xl mb-1 ${color}`}>{value}</Text>
      <Text className="text-xs font-semibold text-slate-500 uppercase">{label}</Text>
    </View>
  );
}
