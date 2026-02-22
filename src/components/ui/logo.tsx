import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sparkles } from 'lucide-react-native';

export default function Logo() {
  return (
    <View style={styles.container}>
      <View style={styles.iconBg}>
        <Sparkles size={32} color="#0891b2" />
      </View>
      <Text style={styles.text}>Aura<Text style={styles.bold}>AAC</Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBg: { padding: 8, backgroundColor: '#cffafe', borderRadius: 99 },
  text: { fontSize: 24, color: '#1e293b' },
  bold: { fontWeight: 'bold', color: '#0891b2' }
});