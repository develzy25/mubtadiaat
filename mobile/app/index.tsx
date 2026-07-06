import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Lock, User, Eye, EyeOff } from 'lucide-react-native';

import { api, setAuthToken } from '../src/services/api';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) return;
    setIsLoading(true);
    
    try {
      // Use the custom fallback endpoint
      const res = await api.post('/auth/mobile-login', { username, password });
      
      const session = res.data?.session;
      const user = res.data?.user;

      if (!session || !user) {
        throw new Error('Invalid credentials');
      }
      
      // Save real token
      await setAuthToken(session.token);
      
      if (user.role === 4) {
        router.replace('/(roles)/mustahiq');
      } else if (user.role === 2 || user.role === 3) {
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
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-8"
      >
        <View className="items-center mb-10">
          <View className="w-28 h-28 rounded-3xl items-center justify-center shadow-2xl shadow-blue-900/20 mb-6 overflow-hidden bg-white border border-slate-100" style={{ elevation: 15 }}>
            <Image source={require('../assets/logo.png')} className="w-full h-full" resizeMode="contain" />
          </View>
          <Text className="text-3xl font-extrabold text-slate-800 tracking-tight">e-Mubtadiaat</Text>
          <Text className="text-slate-500 mt-2 font-medium">Portal Mustahiq & Asatidz</Text>
        </View>

        <View className="bg-white p-7 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100/80 space-y-5" style={{ elevation: 10 }}>
          <View className="space-y-1.5">
            <Text className="text-slate-700 font-bold ml-1 text-sm tracking-wide">Nama Pengguna</Text>
            <View className="flex-row items-center bg-slate-50/80 rounded-2xl border-2 border-slate-100 px-4 h-14 focus:border-blue-500">
              <User size={20} className="text-slate-400 mr-3" />
              <TextInput 
                className="flex-1 text-slate-800 font-semibold h-full"
                placeholder="Masukkan username..."
                placeholderTextColor="#94a3b8"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View className="space-y-1.5 mt-5">
            <Text className="text-slate-700 font-bold ml-1 text-sm tracking-wide">Kata Sandi</Text>
            <View className="flex-row items-center bg-slate-50/80 rounded-2xl border-2 border-slate-100 px-4 h-14">
              <Lock size={20} className="text-slate-400 mr-3" />
              <TextInput 
                className="flex-1 text-slate-800 font-semibold h-full"
                placeholder="Masukkan password..."
                placeholderTextColor="#94a3b8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-2">
                {showPassword ? (
                  <EyeOff size={20} className="text-slate-400" />
                ) : (
                  <Eye size={20} className="text-slate-400" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            onPress={handleLogin}
            disabled={isLoading}
            style={{ elevation: 8 }}
            className={`w-full h-14 rounded-2xl items-center justify-center shadow-lg mt-8 ${isLoading ? 'bg-blue-400 shadow-blue-400/30' : 'bg-gradient-to-r from-blue-600 to-blue-800 bg-blue-700 shadow-blue-700/40 active:scale-[0.98]'}`}
          >
            <Text className="text-white font-extrabold text-lg tracking-wide">
              {isLoading ? 'Memproses...' : 'Masuk Sistem'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
