import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://mubtadiat-db.eppds.workers.dev/api';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized (e.g., clear token, redirect to login)
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = async (token: string) => {
  await AsyncStorage.setItem('auth_token', token);
};

export const clearAuthToken = async () => {
  await AsyncStorage.removeItem('auth_token');
};

export const getMobileDashboard = async (role: string) => {
  return await api.get('/mobile/dashboard', {
    headers: {
      'X-Role': role, // Temporary until real auth handles it
    }
  });
};
