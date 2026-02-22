import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Delete, X } from 'lucide-react-native';
import { useAAC } from '../context/AACContext';

export default function SentenceBar() {
  const { sentence, removeFromSentence, clearSentence, speak } = useAAC();

  const handleSpeak = () => {
    const text = sentence.map(s => s.label).join(' ');
    speak(text);
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal style={styles.scroll} contentContainerStyle={{ gap: 8 }}>
        {sentence.length === 0 && <Text style={styles.placeholder}>Sua frase aqui...</Text>}
        {sentence.map(item => (
          <View key={item.tempId} style={styles.chip}>
            <Text style={styles.chipText}>{item.label}</Text>
            <TouchableOpacity onPress={() => removeFromSentence(item.tempId)}>
              <X size={14} color="#64748b" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnSmall} onPress={clearSentence}>
          <Delete size={20} color="#64748b" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnPlay} onPress={handleSpeak}>
          <Play size={24} color="white" fill="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', padding: 12, backgroundColor: '#f8fafc', alignItems: 'center', gap: 8 },
  scroll: { flex: 1, height: 50 },
  placeholder: { color: '#94a3b8', fontStyle: 'italic', marginTop: 12 },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', gap: 6 },
  chipText: { fontSize: 16, color: '#1e293b' },
  actions: { flexDirection: 'row', gap: 8 },
  btnSmall: { padding: 12, backgroundColor: '#e2e8f0', borderRadius: 8 },
  btnPlay: { padding: 12, backgroundColor: '#2563eb', borderRadius: 8 }
});