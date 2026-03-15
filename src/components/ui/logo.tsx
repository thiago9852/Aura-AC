import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';

export default function Logo() {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <View style={[styles.iconBg, { backgroundColor: colors.primaryBackground }]}>
        <Sparkles size={32} color={colors.primary} />
      </View>
      <Text style={[styles.text, { color: colors.text }]}>Aura<Text style={[styles.bold, { color: colors.primary }]}>AAC</Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBg: { padding: 8, borderRadius: 99 },
  text: { fontSize: 24 },
  bold: { fontWeight: 'bold' }
});