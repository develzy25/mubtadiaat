import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';

export default function NilaiPage() {
  const [scores, setScores] = useState([
    { id: '1', name: 'Aisyah', kitab: 'Taqrib', tamrin: '', ujian: '' },
    { id: '2', name: 'Fatimah', kitab: 'Taqrib', tamrin: '', ujian: '' }
  ]);

  const updateScore = (id: string, type: 'tamrin' | 'ujian', val: string) => {
    setScores(prev => prev.map(s => s.id === id ? { ...s, [type]: val } : s));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Input Nilai E-Rapot</Text>
        <Text style={styles.subtitle}>Kelas: Ibtidaiyyah II-A | Kitab: Taqrib</Text>
      </View>

      <View style={styles.list}>
        {scores.map(s => (
          <View key={s.id} style={styles.card}>
            <Text style={styles.name}>{s.name}</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tamrin</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={s.tamrin}
                  onChangeText={(val) => updateScore(s.id, 'tamrin', val)}
                  placeholder="0-10"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Ujian</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={s.ujian}
                  onChangeText={(val) => updateScore(s.id, 'ujian', val)}
                  placeholder="0-10"
                />
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={{ padding: 16 }}>
        <TouchableOpacity style={styles.btnSave}>
          <Text style={styles.btnSaveText}>Simpan Nilai</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 4 },
  list: { padding: 16, gap: 12 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  name: { fontSize: 16, fontWeight: 'bold', color: '#334155', marginBottom: 12 },
  inputRow: { flexDirection: 'row', gap: 12 },
  inputGroup: { flex: 1 },
  label: { fontSize: 12, fontWeight: '600', color: '#64748b', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 10, fontSize: 16, color: '#1e293b' },
  btnSave: { backgroundColor: '#2563eb', padding: 16, borderRadius: 12, alignItems: 'center' },
  btnSaveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
