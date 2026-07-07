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
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" style={Platform.OS === 'web' ? { minHeight: '100vh', width: '100%' } as any : {}}>
      {/* Premium Light Glassmorphism Abstract Background */}
      <View className="absolute top-[-5%] left-[-10%] w-[350px] h-[350px] bg-blue-200/40 rounded-full blur-[80px]" />
      <View className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-indigo-200/40 rounded-full blur-[80px]" />
      <View className="absolute top-[40%] right-[-5%] w-[150px] h-[150px] bg-cyan-200/30 rounded-full blur-[60px]" />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center items-center"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24, width: Platform.OS === 'web' ? 420 : width }}>
          
          <View className="items-center mb-10 w-full">
            {/* Premium Floating Logo */}
            <View 
              style={{ elevation: 15, shadowColor: '#94A3B8', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 30 }}
              className="w-32 h-32 bg-white rounded-[32px] items-center justify-center mb-8 border border-slate-100"
            >
              <Image source={require('../assets/logo.png')} style={{ width: 80, height: 80 }} resizeMode="contain" />
            </View>
            <Text className="text-4xl font-black text-slate-800 tracking-tight text-center mb-2">e-Mubtadiaat</Text>
            <View className="bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
              <Text className="text-blue-600 font-bold tracking-widest uppercase text-[10px]">Portal Mustahiq & Asatidz</Text>
            </View>
          </View>

          {/* Premium Crisp White Login Card */}
          <View 
            style={{ elevation: 25, shadowColor: '#CBD5E1', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.4, shadowRadius: 40 }}
            className="w-full bg-white rounded-[40px] p-8 border border-white/50 overflow-hidden relative"
          >
            
            {/* Decorative Card Accent */}
            <View className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-80" />

            {/* Input Username */}
            <View className="mb-6 mt-2">
              <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-3 ml-2">Nama Pengguna</Text>
              <View className={`flex-row items-center h-16 px-5 rounded-3xl border transition-colors duration-200 ${focusedInput === 'username' ? 'border-blue-400 bg-blue-50/50' : 'border-slate-100 bg-slate-50'}`}>
                <User size={20} color={focusedInput === 'username' ? '#3B82F6' : '#94A3B8'} className="mr-3" />
                <TextInput 
                  className="flex-1 text-slate-800 font-bold text-base h-full"
                  placeholder="Masukkan username..."
                  placeholderTextColor="#94A3B8"
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
              <View className={`flex-row items-center h-16 px-5 rounded-3xl border transition-colors duration-200 ${focusedInput === 'password' ? 'border-blue-400 bg-blue-50/50' : 'border-slate-100 bg-slate-50'}`}>
                <Lock size={20} color={focusedInput === 'password' ? '#3B82F6' : '#94A3B8'} className="mr-3" />
                <TextInput 
                  className="flex-1 text-slate-800 font-bold text-base h-full"
                  placeholder="Masukkan password..."
                  placeholderTextColor="#94A3B8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  style={{ outlineStyle: 'none' } as any}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-2 -mr-2 rounded-full active:bg-slate-200/50">
                  {showPassword ? (
                    <EyeOff size={20} color="#94A3B8" />
                  ) : (
                    <Eye size={20} color="#3B82F6" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Premium Vibrant Button */}
            <TouchableOpacity 
              onPress={handleLogin}
              disabled={isLoading}
              style={{ elevation: isLoading ? 0 : 12, shadowColor: '#2563EB', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16 }}
              className={`w-full h-16 rounded-[28px] items-center justify-center flex-row ${isLoading ? 'bg-slate-300' : 'bg-blue-600'}`}
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
