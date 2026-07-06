import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MonitoringDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard Monitoring</Text>
      <Text style={styles.subtitle}>Selamat datang Mufatish/Mundzir. Pantau aktivitas di sini.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f766e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  }
});
