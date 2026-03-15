// src/components/ui/SentenceBar.tsx
import React, { useRef } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Delete, X } from 'lucide-react-native';
import { useAAC } from '../../context/AACContext';
import { useTheme } from '../../theme/useTheme';

export default function SentenceBar() {
  const { sentence, removeFromSentence, clearSentence, speak } = useAAC();
  const scrollViewRef = useRef<ScrollView>(null);
  const { colors, isDark } = useTheme();

  const handleSpeak = () => {
    const text = sentence.map(s => s.speechText || s.label).join(' ');
    if (text.trim().length > 0) {
      speak(text);
    }
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.card, shadowColor: colors.cardShadow }]}>
        <ScrollView 
          ref={scrollViewRef}
          horizontal 
          style={styles.scroll} 
          contentContainerStyle={styles.scrollContent} 
          showsHorizontalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })} 
        >
          {sentence.length === 0 && <Text style={[styles.placeholder, { color: colors.textMuted }]}>Sua frase aparecerá aqui...</Text>}
          {sentence.map((item, index) => (
            <View key={item.tempId + index} style={[styles.chip, { backgroundColor: item.colorCode ? (isDark ? `${item.colorCode}30` : `${item.colorCode}15`) : colors.transparentSeparator, borderColor: colors.transparentSeparator }]}>
              <Text style={[styles.chipText, { color: colors.text }]}>{item.label}</Text>
              <TouchableOpacity onPress={() => removeFromSentence(item.tempId)} style={[styles.chipClose, { backgroundColor: colors.transparentSeparator }]}>
                <X size={14} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <View style={styles.actions}>
          <TouchableOpacity style={[styles.btnSmall, { backgroundColor: colors.dangerBackground }]} onPress={clearSentence} activeOpacity={0.7}>
            <Delete size={20} color={colors.danger} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnPlay, { backgroundColor: colors.primary, shadowColor: colors.primary }]} onPress={handleSpeak} activeOpacity={0.8}>
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
    zIndex: 10,
  },
  container: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    gap: 12,
    borderRadius: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  scroll: { flex: 1, minHeight: 44 },
  scrollContent: { gap: 8, alignItems: 'center', paddingHorizontal: 4 },
  placeholder: { fontStyle: 'italic', fontSize: 15 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
  },
  chipText: { fontSize: 15, fontWeight: '600' },
  chipClose: {
    borderRadius: 12,
    padding: 2,
  },
  actions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  btnSmall: { padding: 12, borderRadius: 16 },
  btnPlay: { padding: 14, borderRadius: 16, shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } }
});