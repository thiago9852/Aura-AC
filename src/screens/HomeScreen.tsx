// src/screens/HomeScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAAC } from '../context/AACContext';
import SymbolCard from '../components/ui/SymbolCard';
import CreateSymbolModal from '../components/modals/CreateSymbolModal';
import SymbolActionModal from '../components/modals/SymbolActionModal';
import { SymbolItem } from '../types';
import * as Icons from 'lucide-react-native';

const { ArrowLeft, MessageCircle, Star, LayoutGrid, Folder, Plus } = Icons;

export default function HomeScreen() {
  const { categories, addToSentence, activeTab, speak, activeCategoryId, goBack, navigateToCategory } = useAAC();
  
  // Estado Modal Criação/Edição
  const [showAddModal, setShowAddModal] = useState(false);
  const [editInitialData, setEditInitialData] = useState<SymbolItem | null>(null);

  // Estado Modal Ações
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [selectedActionItem, setSelectedActionItem] = useState<SymbolItem | null>(null);
  const [selectedActionCategory, setSelectedActionCategory] = useState<string | null>(null);

  if (activeTab !== 'home') return null;

  const handlePressSymbol = (item: any) => {
    speak(item.speechText || item.label);
    addToSentence(item);
  };

  const handleLongPress = (item: SymbolItem, categoryId: string) => {
    setSelectedActionItem(item);
    setSelectedActionCategory(categoryId);
    setActionModalVisible(true);
  };

  const handleEdit = (item: SymbolItem) => {
    setEditInitialData(item);
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setEditInitialData(null);
  };

  // Visão de dentro de uma Categoria
  if (activeCategoryId) {
    const category = categories.find(c => c.id === activeCategoryId);
    if (!category) return null;

    return (
      <View style={styles.container}>
        <View style={styles.categoryHeader}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={24} color="#334155" />
          </TouchableOpacity>
          <View style={[styles.headerIconContainer, { backgroundColor: `${category.color}20` }]}>
            <Folder size={20} color={category.color} />
          </View>
          <Text style={styles.title}>{category.name}</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.flatListContent}>
          <View style={styles.grid}>
            {category.items.map((item) => (
              <SymbolCard 
                key={item.id} 
                item={item} 
                onPress={() => handlePressSymbol(item)}
                onLongPress={() => handleLongPress(item, activeCategoryId)} 
              />
            ))}

            <TouchableOpacity 
              style={[styles.addCard, { width: '31%', aspectRatio: 1 }]} 
              onPress={() => setShowAddModal(true)}
              activeOpacity={0.7}
            >
              <Plus size={32} color="#94a3b8" />
              <Text style={styles.addText}>Novo</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <CreateSymbolModal
            visible={showAddModal}
            onClose={closeAddModal}
            categoryId={activeCategoryId}
            initialData={editInitialData}
        />
        
        <SymbolActionModal
            visible={actionModalVisible}
            onClose={() => setActionModalVisible(false)}
            item={selectedActionItem}
            categoryId={selectedActionCategory}
            onEdit={handleEdit}
        />
      </View>
    );
  }

  // Visão Inicial
  const quickAccess = categories.find(c => c.id === 'core');
  const otherCategories = categories.filter(c => c.id !== 'core');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {quickAccess?.items.length ? (
        <>
          <View style={styles.sectionHeader}>
            <View style={styles.iconBg}><Star size={18} color="#0284c7" fill="#0284c7" /></View>
            <Text style={styles.sectionTitle}>Acesso Rápido</Text>
          </View>
          <View style={styles.grid}>
            {quickAccess.items.map((item) => (
              <SymbolCard 
                key={item.id} 
                item={item} 
                onPress={() => handlePressSymbol(item)} 
                onLongPress={() => handleLongPress(item, 'core')}
              />
            ))}
          </View>
        </>
      ) : null}

      {otherCategories.length > 0 && (
        <View style={{ marginTop: quickAccess?.items.length ? 40 : 0, marginBottom: 16 }}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBg, { backgroundColor: '#f3e8ff' }]}><LayoutGrid size={18} color="#9333ea" /></View>
            <Text style={styles.sectionTitle}>Categorias</Text>
          </View>
          <View style={styles.grid}>
            {otherCategories.map((cat) => {
              const IconComponent = (Icons as any)[cat.icon] || Folder;
              const catColor = cat.color.startsWith('#') ? cat.color : '#3b82f6';
              return (
                <TouchableOpacity
                  key={cat.id} style={[styles.catCard, { backgroundColor: catColor + '15' }]}
                  onPress={() => navigateToCategory(cat.id)} activeOpacity={0.7}
                >
                  <View style={[styles.catIconContainer, { backgroundColor: 'white' }]}><IconComponent size={30} color={catColor} strokeWidth={2.2} /></View>
                  <View style={styles.catTextContainer}>
                    <Text style={[styles.catText, { color: '#334155' }]}>{cat.name}</Text>
                    <Text style={styles.catSubtext}>{cat.items.length} {cat.items.length === 1 ? 'símbolo' : 'símbolos'}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {(!quickAccess || quickAccess.items.length === 0) && otherCategories.length === 0 && (
        <View style={styles.emptyState}>
          <MessageCircle size={48} color="#cbd5e1" />
          <Text style={styles.emptyText}>Nenhum símbolo configurado.</Text>
        </View>
      )}

      <CreateSymbolModal visible={showAddModal} onClose={closeAddModal} categoryId={selectedActionCategory || 'core'} initialData={editInitialData} />
      <SymbolActionModal visible={actionModalVisible} onClose={() => setActionModalVisible(false)} item={selectedActionItem} categoryId={selectedActionCategory} onEdit={handleEdit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  content: { padding: 16, paddingBottom: 120 },
  flatListContent: { padding: 16, paddingBottom: 150 },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, gap: 12 },
  backBtn: { padding: 10, backgroundColor: 'white', borderRadius: 99, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  headerIconContainer: { padding: 8, borderRadius: 12 },
  title: { fontSize: 24, fontWeight: '800', color: '#0f172a' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, marginTop: 8, gap: 10 },
  iconBg: { backgroundColor: '#e0f2fe', padding: 8, borderRadius: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', gap: '3%' },
  catCard: { width: '48%', flexDirection: 'row', height: 86, borderRadius: 24, alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  catIconContainer: { padding: 10, borderRadius: 16, marginRight: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  catTextContainer: { flex: 1 },
  catText: { fontSize: 16, fontWeight: '700', letterSpacing: -0.3 },
  catSubtext: { fontSize: 12, color: '#64748b', marginTop: 2, fontWeight: '500' },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyText: { textAlign: 'center', color: '#64748b', marginTop: 16, fontSize: 18, fontWeight: '600' },
  addCard: { backgroundColor: '#f1f5f9', borderRadius: 20, borderWidth: 2, borderColor: '#cbd5e1', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  addText: { color: '#64748b', fontWeight: '700', marginTop: 8, fontSize: 13 }
});