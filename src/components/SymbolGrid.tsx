import React from 'react';
import { View, StyleSheet, Text, ScrollView} from 'react-native';
import { useAAC } from '../context/AACContext';
import SymbolCard from './SymbolCard';
import {MessageCircle} from 'lucide-react-native';

export default function SymbolGrid() {
  const { categories, addToSentence, activeTab } = useAAC();

  if (activeTab !== 'home') return null;

  // Visualização: Itens da Categoria
/*   if (activeCategoryId) {
    const category = categories.find(c => c.id === activeCategoryId);
    if (!category) return null;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <ArrowLeft size={24} color="#334155" />
          </TouchableOpacity>
          <Text style={styles.title}>{category.name}</Text>
        </View>
        <FlatList
          data={category.items}
          keyExtractor={item => item.id}
          numColumns={3}
          renderItem={({ item }) => <SymbolCard item={item} onPress={() => addToSentence(item)} />}
        />
      </View>
    );
  } */

// pega categoria "core" (Essenciais)
  const quickAccess = categories.find(c => c.id === 'core');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* Cabeçalho da Seção */}
      <View style={styles.header}>
        <View style={styles.iconBg}>
           <MessageCircle size={24} color="#0284c7" />
        </View>
        <Text style={styles.title}>Acesso Rápido</Text>
      </View>

      {/* Grid de Ícones */}
      <View style={styles.grid}>
        {quickAccess?.items.map((item) => (
          <View key={item.id} style={styles.cardWrapper}>
            <SymbolCard 
                item={item} 
                onPress={() => addToSentence(item)} 
            />
          </View>
        ))}
      </View>

      {(!quickAccess || quickAccess.items.length === 0) && (
        <Text style={styles.emptyText}>Nenhum símbolo essencial configurado.</Text>
      )}

    </ScrollView>
  );
}

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    content: { padding: 16 },
    
    // Header
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
    iconBg: { backgroundColor: '#e0f2fe', padding: 10, borderRadius: 12 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#334155' },

    // Grid
    grid: { 
      flexDirection: 'row', 
      flexWrap: 'wrap', 
      justifyContent: 'space-between',
      gap: 12
    },
    cardWrapper: { 
      width: '31%', // Garante 3 itens por linha (31% * 3 + espaços < 100%)
      aspectRatio: 1, // Mantém quadrado
    },
    
    emptyText: { textAlign: 'center', color: '#94a3b8', marginTop: 20 }
  });