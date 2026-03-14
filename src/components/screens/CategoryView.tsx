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

const { ArrowLeft, Folder, Plus } = Icons;

export default function CategoryView() {

  const { categories, reorderCategoryItems, settings, addToSentence, speak } = useAAC();

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
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} />
        </TouchableOpacity>

        <Folder size={20} color={category.color} />
        <Text style={styles.title}>{category.name}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
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
                  style={styles.addCard}
                  onTap={() => {
                    setSelectedSymbol(null);
                    setShowCreateModal(true);
                  }}
                >
                  <Plus color="#6f7276" size={32} />
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
      </ScrollView>

      {/* MODAL DE AÇÕES */}
      <SymbolActionModal
        visible={showActionModal}
        onClose={() => setShowActionModal(false)}
        item={selectedSymbol}
        categoryId={id || null}
        onEdit={handleEdit}
      />

      {/* MODAL CRIAR / EDITAR */}
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
    gap: 10
  },

  title: {
    fontSize: 22,
    fontWeight: "800"
  },

  content: {
    padding: 16,
    paddingBottom: 150
  },

  addCard: {
    borderWidth: 2,
    borderColor: "#cbd5e1",
    borderStyle: "dashed",
    backgroundColor: "#f1f5f9",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1
  }
});