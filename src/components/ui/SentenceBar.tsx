// src/components/ui/SentenceBar.tsx
import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Delete, X } from 'lucide-react-native';
import { useAAC } from '../../context/AACContext';

export default function SentenceBar() {
  const { sentence, removeFromSentence, clearSentence, speak } = useAAC();

  const handleSpeak = () => {
    const text = sentence.map(s => s.label).join(' ');
    if (text.trim().length > 0) {
      speak(text);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <ScrollView horizontal style={styles.scroll} contentContainerStyle={styles.scrollContent} showsHorizontalScrollIndicator={false}>
          {sentence.length === 0 && <Text style={styles.placeholder}>Sua frase aparecerá aqui...</Text>}
          {sentence.map(item => (
            <View key={item.tempId} style={[styles.chip, { backgroundColor: item.colorCode ? `${item.colorCode}15` : '#f1f5f9' }]}>
              <Text style={styles.chipText}>{item.label}</Text>
              <TouchableOpacity onPress={() => removeFromSentence(item.tempId)} style={styles.chipClose}>
                <X size={14} color="#64748b" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnSmall} onPress={clearSentence} activeOpacity={0.7}>
            <Delete size={20} color="#ef4444" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnPlay} onPress={handleSpeak} activeOpacity={0.8}>
            <Play size={20} color="white" fill="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#f8fafc',
    zIndex: 10,
  },
  container: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    gap: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  scroll: { flex: 1, minHeight: 44 },
  scrollContent: { gap: 8, alignItems: 'center', paddingHorizontal: 4 },
  placeholder: { color: '#94a3b8', fontStyle: 'italic', fontSize: 15 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  chipText: { fontSize: 15, color: '#334155', fontWeight: '600' },
  chipClose: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 2,
  },
  actions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  btnSmall: { padding: 12, backgroundColor: '#fef2f2', borderRadius: 16 },
  btnPlay: { padding: 14, backgroundColor: '#3b82f6', borderRadius: 16, shadowColor: '#3b82f6', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } }
});