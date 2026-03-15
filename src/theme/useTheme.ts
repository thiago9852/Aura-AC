import { useColorScheme } from 'react-native';
import { Colors } from './colors';

export function useTheme() {
  const scheme = useColorScheme() ?? 'light';
  return {
    isDark: scheme === 'dark',
    colors: Colors[scheme],
  };
}
