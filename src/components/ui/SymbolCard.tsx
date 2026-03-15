// src/components/ui/SymbolCard.tsx
import React, { useRef } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import * as Icons from 'lucide-react-native';
import { SymbolItem } from '../../types';
import { useAAC } from '../../context/AACContext';
import { useTheme } from '../../theme/useTheme';

interface Props {
  item: SymbolItem;
  onPress: () => void;
  onLongPress?: () => void;
  isSortable?: boolean;
}

// Paleta de cores Fitz adaptável
const getFitzgeraldColors = (isDark: boolean): any => ({
  yellow: { bg: isDark ? '#422006' : '#fef9c3', fg: isDark ? '#fef08a' : '#ca8a04', shadow: isDark ? '#713f12' : '#eab308' },
  green: { bg: isDark ? '#052e16' : '#dcfce7', fg: isDark ? '#bbf7d0' : '#16a34a', shadow: isDark ? '#14532d' : '#22c55e' },
  blue: { bg: isDark ? '#172554' : '#dbeafe', fg: isDark ? '#bfdbfe' : '#2563eb', shadow: isDark ? '#1e3a8a' : '#3b82f6' },
  red: { bg: isDark ? '#450a0a' : '#fee2e2', fg: isDark ? '#fecaca' : '#dc2626', shadow: isDark ? '#7f1d1d' : '#ef4444' },
  purple: { bg: isDark ? '#3b0764' : '#f3e8ff', fg: isDark ? '#e9d5ff' : '#9333ea', shadow: isDark ? '#581c87' : '#a855f7' },
  white: { bg: isDark ? '#1e293b' : '#ffffff', fg: isDark ? '#f8fafc' : '#475569', shadow: isDark ? '#020617' : '#94a3b8' },
});

export default function SymbolCard({ item, onPress, onLongPress, isSortable = false }: Props) {
  const { settings } = useAAC();
  const { colors, isDark } = useTheme();
  const Icon = Icons[item.iconName as keyof typeof Icons] as any;
  
  const FITZGERALD_COLORS = getFitzgeraldColors(isDark);
  const theme = FITZGERALD_COLORS[item.colorCode || 'white'] || FITZGERALD_COLORS.white;

  // Lógica do alto contraste
  const isHighContrast = settings.highContrast;
  const bg = isHighContrast ? colors.background : theme.bg;
  const fg = isHighContrast ? colors.text : theme.fg;
  const borderColor = isHighContrast ? theme.shadow : 'transparent';
  const borderWidth = isHighContrast ? 4 : 0;
  const iconBg = isHighContrast ? 'rgba(255,255,255,0.1)' : (isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.7)');

  
  const lastPress = useRef<number>(0);
  const longPressTriggered = useRef(false);

  const handleLongPress = () => {
    longPressTriggered.current = true;
    lastPress.current = 0;
    onLongPress?.();
  };

  const handlePress = () => {
    if (longPressTriggered.current) {
      longPressTriggered.current = false;
      lastPress.current = 0;
      return;
    }

    if (settings.doubleClickToSpeak) {
      const now = Date.now();

      if (lastPress.current && now - lastPress.current < 400) {
        lastPress.current = 0;
        onPress();
      } else {
        lastPress.current = now;
      }
    } else {
      onPress();
    }
  };

  // Lógica do tamanho do grid
  const isSmall = settings.gridSize === 'small';
  const isLarge = settings.gridSize === 'large';

  // Se for sortable, o grid controla o width. Se não, usa porcentagem fixa
  const widthPercentage = isSmall ? '21%' : isLarge ? '47%' : '30%';
  const finalWidth = isSortable ? '100%' : widthPercentage;

  // Lógica do Display Mode
  const displayMode = settings.cardDisplayMode || 'both';
  const showIcon = displayMode === 'both' || displayMode === 'icon';
  const showText = displayMode === 'both' || displayMode === 'text';

  const baseIconSize = isSmall ? 22 : isLarge ? 40 : 28;
  const baseTextSize = isSmall ? 11 : isLarge ? 18 : 13;
  
  const finalIconSize = displayMode === 'icon' ? baseIconSize * 1.5 : baseIconSize;
  const finalTextSize = displayMode === 'text' ? baseTextSize * 1.3 : baseTextSize;

  return (
    <TouchableOpacity
      style={[
        styles.card, 
        { 
          backgroundColor: bg, 
          shadowColor: theme.shadow, 
          width: finalWidth as any,
          borderColor: borderColor,
          borderWidth: borderWidth
        }
      ]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      activeOpacity={0.7}
      delayLongPress={600}
    >
      {showIcon && (
        <View style={[
          styles.iconContainer, 
          { 
            backgroundColor: iconBg, 
            padding: isSmall ? 8 : 12, 
            marginBottom: showText ? 6 : 0
          }
        ]}>
          {Icon && <Icon size={finalIconSize} color={fg} strokeWidth={isHighContrast ? 3 : 2.5} />}
        </View>
      )}

      {showText && (
        <Text 
          style={[styles.label, { color: fg, fontSize: finalTextSize }]} 
          numberOfLines={displayMode === 'text' ? 3 : 2} 
          adjustsFontSizeToFit
        >
          {item.label}
        </Text>
      )}
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
  },
  label: {
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.2,
  }
});