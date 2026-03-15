// src/components/screens/CategoryView.tsx
import React, { useState } from "react";
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from "react-native";
import Sortable from "react-native-sortables";
import { useAAC } from "../../context/AACContext";
import Page from "../layout/Page";
import { useLocalSearchParams, router } from "expo-router";
import SymbolCard from "../ui/SymbolCard";
import SentenceBar from "../ui/SentenceBar";

import SymbolActionModal from "../modals/SymbolActionModal";
import CreateSymbolModal from "../modals/CreateSymbolModal";

import * as Icons from "lucide-react-native";
import { SymbolItem } from "../../types";
import { useTheme } from "../../theme/useTheme";

const { ChevronLeft, Folder, Plus } = Icons;

export default function CategoryView() {

  const { categories, reorderCategoryItems, settings, addToSentence, speak } = useAAC();
  const { colors, isDark } = useTheme();

  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const category = categories.find((c) => c.id === id);
  if (!category) return null;

  const numColumnsMap: any = { small: 4, medium: 3, large: 2 };
  const numColumns = numColumnsMap[settings.gridSize] || 3;

  const dataWithAddButton = [
    ...category.items,
    { id: "ADD_BUTTON_ID", isAddButton: true }
  ];

  // controle dos modals
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolItem | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handlePressSymbol = (item: SymbolItem) => {
    if (!settings.speakOnlyOnPlay) {
      speak(item.speechText || item.label);
    } else {
      addToSentence(item);
    }
  };

  const handleLongPress = (item: SymbolItem) => {
    setSelectedSymbol(item);
    setShowActionModal(true);
  };

  const handleEdit = (item: SymbolItem) => {
    setSelectedSymbol(item);
    setShowCreateModal(true);
  };

  return (
    <Page>
      <SentenceBar />

      <View style={styles.header}>
        <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.border, borderColor: colors.glassBorder }]} onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={[styles.headerIconBadge, { backgroundColor: isDark ? `${category.color}30` : `${category.color}20`, borderColor: colors.glassBorder, borderWidth: 1 }]}>
          <Folder size={20} color={category.color} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>{category.name}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.sectionContainer, { backgroundColor: colors.card, shadowColor: colors.cardShadow }]}>
          <Sortable.Grid
          columns={numColumns}
          data={dataWithAddButton}
          keyExtractor={(item: any) => item.id}
          dragActivationDelay={250}
          rowGap={12}
          columnGap={12}
          onDragEnd={({ data }) => {
            const newOrder = data.filter(
              (i: any): i is SymbolItem => !i.isAddButton
            );

            reorderCategoryItems(id, newOrder);
          }}

          renderItem={({ item }: any) => {

            if (item.isAddButton) {
              return (
                <Sortable.Touchable
                  style={[styles.addCard, { backgroundColor: isDark ? colors.border : '#f1f5f9', borderColor: colors.textMuted }]}
                  onTap={() => {
                    setSelectedSymbol(null);
                    setShowCreateModal(true);
                  }}
                >
                  <Plus color={colors.textSecondary} size={32} />
                </Sortable.Touchable>
              );
            }

            return (
              <Sortable.Touchable
                onTap={() => handlePressSymbol(item)}
                onLongPress={() => handleLongPress(item)}
              >
                <SymbolCard
                  item={item}
                  isSortable
                  onPress={() => {}}
                  onLongPress={() => {}}
                />
              </Sortable.Touchable>
            );
          }}
        />
        </View>
      </ScrollView>

      {/* Modal de Ações */}
      <SymbolActionModal
        visible={showActionModal}
        onClose={() => setShowActionModal(false)}
        item={selectedSymbol}
        categoryId={id || null}
        onEdit={handleEdit}
      />

      {/* Modal add/edit */}
      <CreateSymbolModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        categoryId={id}
        initialData={selectedSymbol}
      />

    </Page>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingBottom: 0,
    gap: 12
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,             
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  headerIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  content: {
    padding: 16,
    paddingBottom: 150
  },

  sectionContainer: {
    borderRadius: 24,
    padding: 16,
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    minHeight: 200,
  },

  addCard: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1
  }
});