// src/components/ui/SymbolCard.tsx
import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import * as Icons from 'lucide-react-native';
import { SymbolItem } from '../../types';

interface Props {
  item: SymbolItem;
  onPress: () => void;
  onLongPress?: () => void;
}

// Paleta de cores Fitz
const FITZGERALD_COLORS: any = {
  yellow: { bg: '#fef9c3', fg: '#ca8a04', shadow: '#eab308' },
  green: { bg: '#dcfce7', fg: '#16a34a', shadow: '#22c55e' },
  blue: { bg: '#dbeafe', fg: '#2563eb', shadow: '#3b82f6' },
  red: { bg: '#fee2e2', fg: '#dc2626', shadow: '#ef4444' },
  purple: { bg: '#f3e8ff', fg: '#9333ea', shadow: '#a855f7' },
  white: { bg: '#ffffff', fg: '#475569', shadow: '#94a3b8' },
};

export default function SymbolCard({ item, onPress, onLongPress }: Props) {
  const Icon = Icons[item.iconName as keyof typeof Icons] as any;
  const theme = FITZGERALD_COLORS[item.colorCode || 'white'] || FITZGERALD_COLORS.white;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.bg, shadowColor: theme.shadow }]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      delayLongPress={350} 
    >
      <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.7)' }]}>
        {Icon && <Icon size={28} color={theme.fg} strokeWidth={2.5} />}
      </View>
      <Text style={[styles.label, { color: theme.fg }]} numberOfLines={2} adjustsFontSizeToFit>
        {item.label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    marginBottom: 12
  },
  iconContainer: {
    borderRadius: 20,
    marginBottom: 6,
    padding: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.2,
  }
});