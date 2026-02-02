import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import * as Icons from 'lucide-react-native';
import { SymbolItem } from '../types';

interface Props {
  item: SymbolItem;
  onPress: () => void;
}

// Paleta Fitzgerald = Cor da borda
const FITZGERALD_COLORS: any = {
    yellow: { border: '#eab308', text: '#854d0e' },
    green:  { border: '#22c55e', text: '#15803d' },
    blue:   { border: '#3b82f6', text: '#1e40af' },
    red:    { border: '#ef4444', text: '#991b1b' },
    purple: { border: '#a855f7', text: '#6b21a8' },
    white:  { border: '#cbd5e1', text: '#334155' },
};

export default function SymbolCard({ item, onPress }: Props) {
  const Icon = Icons[item.iconName as keyof typeof Icons] as any;

  const colorKey = item.colorCode || 'white';
  const theme = FITZGERALD_COLORS[colorKey] || FITZGERALD_COLORS.white;
  
  return (
    <TouchableOpacity style={[styles.card, { 
      borderColor: theme.border, 
      backgroundColor: theme.bg,
      borderLeftWidth: 6,
      }]} onPress={onPress}>
      {Icon && <Icon size={32} color={theme.border} />}
      <Text style={[styles.label, { color: theme.text }]}>{item.label}</Text>
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