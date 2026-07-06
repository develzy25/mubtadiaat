import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RekapPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rekapitulasi Data</Text>
      <Text style={styles.subtitle}>Fitur ini akan segera diimplementasikan (Grafik & Laporan).</Text>
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
    fontSize: 20,
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
