import React from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useAAC } from '../context/AACContext';
import SymbolCard from './SymbolCard';
import { ArrowLeft } from 'lucide-react-native';

export default function SymbolGrid() {
  const { categories, activeCategoryId, navigateToCategory, goBack, addToSentence, activeTab } = useAAC();

  if (activeTab !== 'home') return <View style={styles.center}><Text>Em desenvolvimento</Text></View>;

  // Visualização: Itens da Categoria
  if (activeCategoryId) {
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
  }

  // Visualização: Lista de Categorias
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { padding: 16 }]}>Categorias</Text>
      <FlatList
        data={categories}
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.catCard, { backgroundColor: item.color.startsWith('#') ? item.color : '#e0f2fe' }]} 
            onPress={() => navigateToCategory(item.id)}
          >
            <Text style={styles.catText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  backBtn: { padding: 8, backgroundColor: 'white', borderRadius: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
  catCard: { flex: 1, margin: 8, height: 120, borderRadius: 16, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  catText: { fontSize: 18, fontWeight: 'bold', color: '#334155' }
});