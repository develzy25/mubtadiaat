import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Image, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Lock, User, Eye, EyeOff, LogIn } from 'lucide-react-native';
import { api, setAuthToken } from '../src/services/api';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<'username' | 'password' | null>(null);

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

  return (
    <SafeAreaView className="flex-1 bg-[#09090B]" style={Platform.OS === 'web' ? { minHeight: '100vh', width: '100%' } : {}}>
      {/* Deep Space Dark Glassmorphism Abstract Background */}
      <View className="absolute top-[-10%] left-[-20%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
      <View className="absolute bottom-[-10%] right-[-20%] w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[100px]" />
      <View className="absolute top-[30%] right-[-10%] w-[200px] h-[200px] bg-emerald-500/10 rounded-full blur-[80px]" />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center items-center"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24, width: Platform.OS === 'web' ? 420 : width }}>
          
          <View className="items-center mb-10 w-full">
            {/* Premium Floating Logo */}
            <View 
              style={{ elevation: 20, shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 30 }}
              className="w-32 h-32 bg-[#18181B] rounded-[32px] items-center justify-center mb-8 border border-white/10"
            >
              <Image source={require('../assets/logo.png')} style={{ width: 80, height: 80 }} resizeMode="contain" />
            </View>
            <Text className="text-4xl font-black text-white tracking-tight text-center mb-2">e-Mubtadiaat</Text>
            <View className="bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
              <Text className="text-slate-300 font-bold tracking-widest uppercase text-[10px]">Portal Mustahiq & Asatidz</Text>
            </View>
          </View>

          {/* Premium Glassmorphism Login Card */}
          <View className="w-full bg-[#18181B]/80 rounded-[40px] p-8 border border-white/10 overflow-hidden relative">
            
            {/* Decorative Card Glow */}
            <View className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

            {/* Input Username */}
            <View className="mb-6 mt-2">
              <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-3 ml-2">Nama Pengguna</Text>
              <View className={`flex-row items-center h-16 px-5 rounded-3xl border transition-colors duration-200 ${focusedInput === 'username' ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/5 bg-white/5'}`}>
                <User size={20} color={focusedInput === 'username' ? '#60A5FA' : '#64748B'} className="mr-3" />
                <TextInput 
                  className="flex-1 text-white font-semibold text-base h-full"
                  placeholder="Masukkan username..."
                  placeholderTextColor="#475569"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  onFocus={() => setFocusedInput('username')}
                  onBlur={() => setFocusedInput(null)}
                  style={{ outlineStyle: 'none' } as any}
                />
              </View>
            </View>

            {/* Input Password */}
            <View className="mb-10">
              <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-3 ml-2">Kata Sandi</Text>
              <View className={`flex-row items-center h-16 px-5 rounded-3xl border transition-colors duration-200 ${focusedInput === 'password' ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/5 bg-white/5'}`}>
                <Lock size={20} color={focusedInput === 'password' ? '#60A5FA' : '#64748B'} className="mr-3" />
                <TextInput 
                  className="flex-1 text-white font-semibold text-base h-full"
                  placeholder="Masukkan password..."
                  placeholderTextColor="#475569"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  style={{ outlineStyle: 'none' } as any}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-2 -mr-2">
                  {showPassword ? (
                    <EyeOff size={20} color="#64748B" />
                  ) : (
                    <Eye size={20} color="#60A5FA" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Neon Glow Button */}
            <TouchableOpacity 
              onPress={handleLogin}
              disabled={isLoading}
              style={{ elevation: isLoading ? 0 : 15, shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 20 }}
              className={`w-full h-16 rounded-[28px] items-center justify-center flex-row ${isLoading ? 'bg-[#27272A]' : 'bg-[#2563EB]'}`}
            >
              {!isLoading && <LogIn size={20} color="white" className="mr-3" />}
              <Text className={`font-black text-base tracking-widest ${isLoading ? 'text-slate-500' : 'text-white'}`}>
                {isLoading ? 'MEMPROSES...' : 'MASUK SISTEM'}
              </Text>
            </TouchableOpacity>
            
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
