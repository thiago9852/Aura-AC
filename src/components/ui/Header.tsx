// src/components/ui/Header.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User } from 'lucide-react-native';
import SettingsModal from '../../../app/(modals)/settings';
import { useTheme } from '../../theme/useTheme';

export default function Header() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: colors.background }]}>
      <View>
        <Text style={[styles.greeting, { color: colors.textSecondary }]}>Bem-vindo,</Text>
        <Text style={[styles.username, { color: colors.text }]}>Visitante</Text>
      </View>
      <TouchableOpacity
        style={[styles.profileBtn, { backgroundColor: colors.card, borderColor: colors.glassBorder, shadowColor: colors.cardShadow }]}
        activeOpacity={0.7}
        onPress={() => setIsSettingsOpen(true)}
      >
        <User size={24} color={colors.text} />
      </TouchableOpacity>

      <SettingsModal visible={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  greeting: { fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: '600' },
  username: { fontSize: 24, fontWeight: '800', marginTop: 2 },
  profileBtn: {
    padding: 12,
    borderRadius: 99,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  }
});