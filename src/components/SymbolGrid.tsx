import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useAAC } from '../context/AACContext';
import SymbolCard from './SymbolCard';
import CreateSymbolModal from './creates/CreateSymbolModal'; 

import { 
    ArrowLeft, MessageCircle, Heart, Star, LayoutGrid, Check, X, Hand, 
    ThumbsUp, MousePointer2, LifeBuoy, Octagon, CheckCircle, Utensils,
    Smile, Home, Gamepad, Music, Sun, Book, Briefcase, ShoppingBag, Folder, Plus
} from 'lucide-react-native';

const ICON_MAP: any = {
    MessageCircle, Heart, Star, LayoutGrid, Check, X, Hand, 
    ThumbsUp, MousePointer2, LifeBuoy, Octagon, CheckCircle, Utensils,
    Smile, Home, Gamepad, Music, Sun, Book, Briefcase, ShoppingBag
};

export default function SymbolGrid() {
  const { categories, addToSentence, activeTab, speak, activeCategoryId, goBack, navigateToCategory } = useAAC();
  
  // estado do Modal
  const [showAddModal, setShowAddModal] = useState(false); 

  if (activeTab !== 'home') return null;


  if (activeCategoryId) {
    const category = categories.find(c => c.id === activeCategoryId);
    if (!category) return null;

    const dataWithAddButton = [...category.items, { id: 'ADD_BUTTON_ID', label: 'Novo', isAddButton: true }];

    return (
      <View style={styles.container}>
        <View style={[styles.categoryHeader, { borderBottomColor: category.color }]}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <ArrowLeft size={24} color="#334155" />
          </TouchableOpacity>
          <Text style={styles.title}>{category.name}</Text>
        </View>
        
        <FlatList
          data={dataWithAddButton} 
          keyExtractor={item => item.id}
          numColumns={3}
          contentContainerStyle={styles.flatListContent}
          renderItem={({ item }: { item: any }) => {
            if (item.isAddButton) {
                return (
                    <View style={styles.cardWrapper}>
                        <TouchableOpacity 
                            style={styles.addCard} 
                            onPress={() => setShowAddModal(true)}
                        >
                            <Plus size={32} color="#94a3b8" />
                            <Text style={styles.addText}>Novo</Text>
                        </TouchableOpacity>
                    </View>
                );
            }

            return (
                <View style={styles.cardWrapper}>
                    <SymbolCard 
                        item={item} 
                        onPress={() => {
                            speak(item.label);
                            addToSentence(item);
                        }} 
                    />
                </View>
            );
          }}
        />

        <CreateSymbolModal 
            visible={showAddModal} 
            onClose={() => setShowAddModal(false)}
            categoryId={activeCategoryId}
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
                            style={[styles.catCard, { backgroundColor: catColor + '30' }]}
                            onPress={() => navigateToCategory(cat.id)}
                        >
                            <IconComponent size={32} style={{ color: catColor }}/>
                            <Text style={[styles.catText, { color: catColor }]}>{cat.name}</Text>
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

    // Card da Categoria
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
    catText: { fontSize: 16, fontWeight: 'bold', marginTop: 8 },

    emptyText: { textAlign: 'center', color: '#94a3b8', marginTop: 20 },

    // Card item Categoria
    addCard: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#cbd5e1',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center'
    },
    addText: { color: '#94a3b8', fontWeight: 'bold', marginTop: 4 }
});