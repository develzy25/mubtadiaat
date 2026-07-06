import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Lock, User } from 'lucide-react-native';

import { api, setAuthToken } from '../src/services/api';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) return;
    setIsLoading(true);
    
    try {
      // Simulate real API for better-auth
      // const res = await api.post('/api/auth/sign-in/email', { email: username, password });
      
      // Since better-auth requires specific client setup, we will mock the role detection for now
      // assuming the API returns role in user object
      const simulatedRole = username.includes('admin') ? 1 : username.includes('mundzir') ? 2 : username.includes('mufatish') ? 3 : 4;
      
      // Save simulated token
      await setAuthToken('dummy_token_123');
      
      if (simulatedRole === 4) {
        router.replace('/(roles)/mustahiq');
      } else if (simulatedRole === 2 || simulatedRole === 3) {
        router.replace('/(roles)/monitoring');
      } else {
        // Admin
        router.replace('/(dashboard)');
      }
    } catch (err) {
      alert('Login gagal, periksa kredensial Anda');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-8"
      >
        <View className="items-center mb-10">
          <View className="w-24 h-24 rounded-3xl items-center justify-center shadow-xl shadow-blue-900/10 mb-6 overflow-hidden">
            <Image source={require('../assets/logo.png')} className="w-full h-full" resizeMode="cover" />
          </View>
          <Text className="text-3xl font-extrabold text-slate-800 tracking-tight">e-Mubtadiaat</Text>
          <Text className="text-slate-500 mt-2 font-medium">Masuk untuk melanjutkan</Text>
        </View>

        <View className="bg-white p-6 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-50 space-y-4">
          <View className="space-y-1.5">
            <Text className="text-slate-700 font-semibold ml-1 text-sm">Nama Pengguna</Text>
            <View className="flex-row items-center bg-slate-50 rounded-2xl border border-slate-100 px-4 h-14 focus:border-blue-300">
              <User size={20} className="text-slate-400 mr-3" />
              <TextInput 
                className="flex-1 text-slate-800 font-medium h-full"
                placeholder="Masukkan username..."
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View className="space-y-1.5 mt-4">
            <Text className="text-slate-700 font-semibold ml-1 text-sm">Kata Sandi</Text>
            <View className="flex-row items-center bg-slate-50 rounded-2xl border border-slate-100 px-4 h-14">
              <Lock size={20} className="text-slate-400 mr-3" />
              <TextInput 
                className="flex-1 text-slate-800 font-medium h-full"
                placeholder="Masukkan password..."
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity 
            onPress={handleLogin}
            disabled={isLoading}
            className={`w-full h-14 rounded-2xl items-center justify-center shadow-lg shadow-blue-800/30 mt-6 ${isLoading ? 'bg-blue-600' : 'bg-blue-800 active:scale-[0.98]'}`}
          >
            <Text className="text-white font-bold text-lg">
              {isLoading ? 'Memproses...' : 'Masuk Sistem'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
