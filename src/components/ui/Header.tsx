import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User } from 'lucide-react-native';

export default function Header() {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Bem-vindo,</Text>
        <Text style={styles.username}>Visitante</Text>
      </View>
      <TouchableOpacity style={styles.profileBtn}>
        <User size={24} color="#475569" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingTop: 10
  },
  greeting: { fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 },
  username: { fontSize: 20, fontWeight: 'bold', color: '#334155' },
  profileBtn: { padding: 10, backgroundColor: '#f1f5f9', borderRadius: 25 }
});