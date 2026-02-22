import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User } from 'lucide-react-native';
import SettingsModal from '../modals/SettingsModal';

export default function Header() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Bem-vindo,</Text>
        <Text style={styles.username}>Visitante</Text>
      </View>
      <TouchableOpacity
        style={styles.profileBtn}
        activeOpacity={0.7}
        onPress={() => setIsSettingsOpen(true)}
      >
        <User size={24} color="#334155" />
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
    backgroundColor: '#f8fafc',
  },
  greeting: { fontSize: 13, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: '600' },
  username: { fontSize: 24, fontWeight: '800', color: '#0f172a', marginTop: 2 },
  profileBtn: {
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 99,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  }
});