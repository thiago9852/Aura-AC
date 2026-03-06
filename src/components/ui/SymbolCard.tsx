// src/components/ui/SymbolCard.tsx
import React, { useRef } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import * as Icons from 'lucide-react-native';
import { SymbolItem } from '../../types';
import { useAAC } from '../../context/AACContext';

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
  const { settings } = useAAC();
  const Icon = Icons[item.iconName as keyof typeof Icons] as any;
  const theme = FITZGERALD_COLORS[item.colorCode || 'white'] || FITZGERALD_COLORS.white;

  // Lógica do Alto Contraste
  const isHighContrast = settings.highContrast;
  const bg = isHighContrast ? '#0f172a' : theme.bg;
  const fg = isHighContrast ? '#ffffff' : theme.fg;
  const borderColor = isHighContrast ? theme.shadow : 'transparent';
  const borderWidth = isHighContrast ? 4 : 0;
  const iconBg = isHighContrast ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.7)';

  // Lógica do Duplo Clique
  const lastPress = useRef<number>(0);
  const handlePress = () => {
    if (settings.doubleClickToSpeak) {
      const now = Date.now();
      if (now - lastPress.current < 400) {
        onPress();
        lastPress.current = 0;
      } else {
        lastPress.current = now;
      }
    } else {
      onPress();
    }
  };

  // Lógica do Tamanho do Grid
  const isSmall = settings.gridSize === 'small';
  const isLarge = settings.gridSize === 'large';

  // O tamanho dinâmico
  const iconSize = isSmall ? 22 : isLarge ? 40 : 28;
  const textSize = isSmall ? 11 : isLarge ? 18 : 13;

  // Ajustado para o Acesso Rápido
  const widthPercentageMap: any = { small: '22%', medium: '30%', large: '47%' };
  const fixedCardWidth = widthPercentageMap[settings.gridSize] || '30%';

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: bg, shadowColor: borderColor, borderWidth, width: fixedCardWidth }]}
      onPress={handlePress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      delayLongPress={350}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
        {Icon && <Icon size={iconSize} color={fg} strokeWidth={2.5} />}
      </View>
      <Text style={[styles.label, { color: fg, fontSize: textSize }]} numberOfLines={2} adjustsFontSizeToFit>
        {item.label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
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