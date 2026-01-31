import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useAAC } from '../context/AACContext';
import SymbolCard from './SymbolCard';

import { 
    ArrowLeft, MessageCircle, Heart, Star, LayoutGrid, Check, X, Hand, 
    ThumbsUp, MousePointer2, LifeBuoy, Octagon, CheckCircle, Utensils,
    Smile, Home, Gamepad, Music, Sun, Book, Briefcase, ShoppingBag, Folder
} from 'lucide-react-native';

const ICON_MAP: any = {
    MessageCircle, Heart, Star, LayoutGrid, Check, X, Hand, 
    ThumbsUp, MousePointer2, LifeBuoy, Octagon, CheckCircle, Utensils,
    Smile, Home, Gamepad, Music, Sun, Book, Briefcase, ShoppingBag
};

export default function SymbolGrid() {
  const { categories, addToSentence, activeTab, speak, activeCategoryId, goBack, navigateToCategory } = useAAC();

  if (activeTab !== 'home') return null;


  if (activeCategoryId) {
    const category = categories.find(c => c.id === activeCategoryId);
    if (!category) return null;

    return (
      <View style={styles.container}>
        <View style={[styles.categoryHeader, { borderBottomColor: category.color }]}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <ArrowLeft size={24} color="#334155" />
          </TouchableOpacity>
          <Text style={styles.title}>{category.name}</Text>
        </View>
        
        <FlatList
          data={category.items}
          keyExtractor={item => item.id}
          numColumns={3}
          contentContainerStyle={styles.flatListContent}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
                <SymbolCard 
                    item={item} 
                    onPress={() => {
                        speak(item.label);
                        addToSentence(item);
                    }} 
                />
            </View>
          )}
        />
      </View>
    );
  }

  // Acesso rápido e pastas
  const quickAccess = categories.find(c => c.id === 'core');
  const otherCategories = categories.filter(c => c.id !== 'core');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* Acesso rápido */}
      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <View style={styles.iconBg}>
           <MessageCircle size={20} color="#0284c7" />
        </View>
        <Text style={styles.sectionTitle}>Acesso Rápido</Text>
      </View>

      <View style={styles.grid}>
        {quickAccess?.items.map((item) => (
          <View key={item.id} style={styles.cardWrapper}>
            <SymbolCard 
                item={item} 
                onPress={() => {
                  speak(item.label);
                  addToSentence(item);
                }} 
            />
          </View>
        ))}
      </View>

      {/* Pastas / Categorias */}
      {otherCategories.length > 0 && (
          <>
            <View style={[styles.sectionHeader, { marginTop: 50 }]}>
                <View style={styles.iconBg}>
                    <LayoutGrid size={20} color="#0284c7" />
                </View>
                <Text style={styles.sectionTitle}>Categorias</Text>
            </View>

            <View style={styles.grid}>
                {otherCategories.map((cat) => {
                   
                    const IconComponent = ICON_MAP[cat.icon] || Folder;
                    const catColor = cat.color.startsWith('#') ? cat.color : '#3b82f6';
                    
                    return (
                        <TouchableOpacity 
                            key={cat.id} 
                            style={[styles.catCard, { backgroundColor: catColor + '20' }]}
                            onPress={() => navigateToCategory(cat.id)}
                        >
                            <IconComponent size={32} color="black" />
                            <Text style={styles.catText}>{cat.name}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
          </>
      )}

      {(!quickAccess || quickAccess.items.length === 0) && otherCategories.length === 0 && (
        <Text style={styles.emptyText}>Nenhum símbolo configurado.</Text>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    content: { padding: 16, paddingBottom: 100 },
    flatListContent: { padding: 16, gap: 12 },

    // Headers
    categoryHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: 'white', borderBottomWidth: 4, gap: 12 },
    backBtn: { padding: 8, backgroundColor: '#f1f5f9', borderRadius: 20 },
    title: { fontSize: 20, fontWeight: 'bold', color: '#334155' },

    // Seções da Home
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10 },
    iconBg: { backgroundColor: '#e0f2fe', padding: 8, borderRadius: 8 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#475569' },

    // Grid Comum
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
    
    // Wrapper do Símbolo (Acesso Rápido)
    cardWrapper: { width: '31%', aspectRatio: 1 },

    // Card da Categoria (Pasta)
    catCard: {
        width: '48%',
        height: 100,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 4
    },
    catText: { fontSize: 16, fontWeight: 'bold', color: 'black', marginTop: 8 },

    emptyText: { textAlign: 'center', color: '#94a3b8', marginTop: 20 }
});