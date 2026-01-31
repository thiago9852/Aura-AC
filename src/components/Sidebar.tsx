import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Home, Star, Calendar, FolderCog } from 'lucide-react-native';
import { useAAC } from '../context/AACContext';
import { NavigationTab } from '../types';

export default function Sidebar() {
  const { activeTab, setActiveTab } = useAAC();

  const tabs: { id: NavigationTab, icon: any, label: string }[] = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'favorites', icon: Star, label: 'Favoritos' },
    { id: 'agenda', icon: Calendar, label: 'Agenda' },
    { id: 'manage', icon: FolderCog, label: 'Gerenciar' }
  ];

  return (
    <View style={styles.bar}>
      {tabs.map((t) => {
        const isActive = activeTab === t.id;
        return (
          <TouchableOpacity
            key={t.id}
            style={styles.tab}
            onPress={() => setActiveTab(t.id)}
          >
            <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
              <t.icon size={24} color={isActive ? '#2563eb' : '#94a3b8'} />
            </View>
            <Text style={[styles.label, isActive && styles.activeLabel]}>{t.label}</Text>
          </TouchableOpacity>
        )
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingBottom: 24, // Espaço extra para iPhones novos
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  tab: { alignItems: 'center', flex: 1 },
  iconContainer: { padding: 8, borderRadius: 20 },
  activeIconContainer: { backgroundColor: '#eff6ff' },
  label: { fontSize: 10, color: '#94a3b8', marginTop: 4, fontWeight: '500' },
  activeLabel: { color: '#2563eb', fontWeight: 'bold' }
});