// src/components/screens/FavoritesView.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import Sortable from 'react-native-sortables';
import Page from '../layout/Page';
import { useAAC } from '../../context/AACContext';
import SymbolCard from '../../components/ui/SymbolCard';
import SymbolActionModal from '../../components/modals/SymbolActionModal'; 
import SentenceBar from '../../components/ui/SentenceBar';
import { SymbolItem } from '../../types';
import * as Icons from 'lucide-react-native';

const { Star } = Icons;

export default function Favorites() {
  const {
    favorites,
    addToSentence,
    speak,
    settings,
    reorderFavorites
  } = useAAC();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editInitialData, setEditInitialData] = useState<SymbolItem | null>(null);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [selectedActionItem, setSelectedActionItem] = useState<SymbolItem | null>(null);
  const [selectedActionCategory, setSelectedActionCategory] = useState<string | null>(null);

  const numColumnsMap: any = { small: 4, medium: 3, large: 2 };
  const numColumns = numColumnsMap[settings.gridSize] || 3;

  const handlePressSymbol = (item: any) => {
    if (!settings.speakOnlyOnPlay) {
      speak(item.speechText || item.label);
    } else {
      addToSentence(item);
    }
  };

  const handleLongPress = (item: SymbolItem, categoryId: string | null = null) => {
    setSelectedActionItem(item);
    setSelectedActionCategory(categoryId);
    setActionModalVisible(true);
  };

  const handleEdit = (item: SymbolItem) => {
    setEditInitialData(item);
    setShowAddModal(true);
  };

  const renderModals = () => (
    <>
      <SymbolActionModal visible={actionModalVisible} onClose={() => 
        setActionModalVisible(false)} 
        item={selectedActionItem} 
        categoryId={selectedActionCategory} 
        onEdit={handleEdit} 
      />
    </>
  );

  return (
    <Page>
      <SentenceBar />

      <View style={styles.categoryHeader}>
        <View style={[styles.headerIconContainer, { backgroundColor: '#fef9c3' }]}>
          <Star size={24} color="#eab308" fill="#eab308" />
        </View>
        <Text style={styles.title}>Meus Favoritos</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <Star size={48} color="#cbd5e1" />
          <Text style={styles.emptyText}>Nenhum símbolo favoritado.</Text>
          <Text style={styles.emptySubtext}>Pressione e segure um cartão em qualquer categoria para adicioná-lo aqui.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.flatListContent}>
          <Sortable.Grid
            columns={numColumns}
            data={favorites}
            keyExtractor={(item) => item.id}
            rowGap={12}
            columnGap={12}
            onDragEnd={({ data }) => reorderFavorites(data)}
            renderItem={({ item }) => (
              <Sortable.Touchable
                onTap={() => handlePressSymbol(item)}
                onLongPress={() => handleLongPress(item, null)}
              >
                <SymbolCard
                  item={item}
                  isSortable={true}
                  onPress={() => {}}
                  onLongPress={() => {}}
                />
              </Sortable.Touchable>
            )}
          />
        </ScrollView>
      )}
      
      {renderModals()}

    </Page>
  );
}

const styles = StyleSheet.create({
  flatListContent: { padding: 16, paddingBottom: 150 },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, gap: 12 },
  headerIconContainer: { padding: 8, borderRadius: 12 },
  title: { fontSize: 24, fontWeight: '800', color: '#0f172a' },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyText: { textAlign: 'center', color: '#64748b', marginTop: 16, fontSize: 18, fontWeight: '600' },
  emptySubtext: { textAlign: 'center', color: '#94a3b8', marginTop: 8, fontSize: 14, paddingHorizontal: 20 },
});