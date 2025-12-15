import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import * as Icons from 'lucide-react-native';
import { SymbolItem } from '../types/types';

interface Props {
  item: SymbolItem;
  onPress: () => void;
}

export default function SymbolCard({ item, onPress }: Props) {
  const Icon = item.iconName ? (Icons[item.iconName as keyof typeof Icons] as any) : Icons.Box;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {Icon && <Icon size={32} color="#334155" />}
      <Text style={styles.label}>{item.label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2, // Sombra Android
    shadowColor: '#000', // Sombra iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    margin: 4,
    flex: 1,
    minWidth: '30%'
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1e293b'
  }
});