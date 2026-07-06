import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Image, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Lock, User, Eye, EyeOff } from 'lucide-react-native';
import { api, setAuthToken } from '../src/services/api';

const { width } = Dimensions.get('window');

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
      const res = await api.post('/auth/mobile-login', { username, password });
      
      const session = res.data?.session;
      const user = res.data?.user;

      if (!session || !user) {
        throw new Error('Invalid credentials');
      }
      
      await setAuthToken(session.token);
      router.replace('/(main)');
    } catch (err) {
      alert('Login gagal, periksa kredensial Anda');
    } finally {
      setIsLoading(false);
    }
  };

  // Neumorphic Outer Shadow
  const neumorphicShadow = {
    elevation: 12,
    shadowColor: '#94A3B8',
    shadowOffset: { width: 8, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    backgroundColor: '#FFFFFF'
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F4F7FC]">
      
      {/* 3D Glassmorphism Abstract Background */}
      <View className="absolute top-[-10%] left-[-20%] w-[300px] h-[300px] bg-blue-300/30 rounded-full blur-[80px]" />
      <View className="absolute bottom-[-10%] right-[-20%] w-[350px] h-[350px] bg-indigo-300/30 rounded-full blur-[100px]" />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center items-center"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24, width: Platform.OS === 'web' ? 400 : width }}>
          
          <View className="items-center mb-10 w-full">
            {/* 3D Logo Container */}
            <View 
              style={{ elevation: 15, shadowColor: '#94A3B8', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20 }}
              className="w-36 h-36 bg-white rounded-full items-center justify-center mb-6 border-4 border-white"
            >
              <Image source={require('../assets/logo.png')} style={{ width: 100, height: 100 }} resizeMode="contain" />
            </View>
            <Text className="text-3xl font-black text-slate-800 tracking-tight text-center">e-Mubtadiaat</Text>
            <Text className="text-slate-500 mt-2 font-bold tracking-widest uppercase text-xs">Portal Mustahiq & Asatidz</Text>
          </View>

          {/* Neumorphic Login Card */}
          <View style={[neumorphicShadow, { borderRadius: 40, width: '100%', padding: 32, borderCurve: 'continuous', borderWidth: 2, borderColor: '#FFFFFF' }]}>
            
            <View className="space-y-2 mb-6">
              <Text className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider ml-2">Nama Pengguna</Text>
              <View className="flex-row items-center bg-[#F1F5F9] rounded-[24px] border border-white px-5 h-16 shadow-sm">
                <User size={22} className="text-blue-500 mr-4" />
                <TextInput 
                  className="flex-1 text-slate-800 font-bold text-base h-full"
                  placeholder="Masukkan username..."
                  placeholderTextColor="#94A3B8"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  style={{ outlineStyle: 'none' } as any} // Remove web focus ring
                />
              </View>
            </View>

            <View className="space-y-2 mb-8">
              <Text className="text-slate-500 font-extrabold text-[11px] uppercase tracking-wider ml-2">Kata Sandi</Text>
              <View className="flex-row items-center bg-[#F1F5F9] rounded-[24px] border border-white px-5 h-16 shadow-sm">
                <Lock size={22} className="text-blue-500 mr-4" />
                <TextInput 
                  className="flex-1 text-slate-800 font-bold text-base h-full"
                  placeholder="Masukkan password..."
                  placeholderTextColor="#94A3B8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={{ outlineStyle: 'none' } as any} // Remove web focus ring
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-2 bg-white rounded-full shadow-sm ml-2">
                  {showPassword ? (
                    <EyeOff size={18} color="#94A3B8" />
                  ) : (
                    <Eye size={18} color="#3B82F6" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Premium 3D Button */}
            <TouchableOpacity 
              onPress={handleLogin}
              disabled={isLoading}
              style={{ elevation: 8, shadowColor: '#2563EB', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16 }}
              className={`w-full h-16 rounded-[24px] items-center justify-center ${isLoading ? 'bg-blue-400' : 'bg-[#2563EB]'}`}
            >
              {/* Inner highlight for 3D effect */}
              <View className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-t-[24px]" />
              <Text className="text-white font-black text-lg tracking-wider">
                {isLoading ? 'MEMPROSES...' : 'MASUK SISTEM'}
              </Text>
            </TouchableOpacity>
            
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
