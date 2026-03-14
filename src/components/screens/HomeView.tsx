import React, { useState } from "react";
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as Icons from "lucide-react-native";
import { router } from "expo-router";
import { useAAC } from "../../context/AACContext";
import SymbolCard from "../ui/SymbolCard";
import SentenceBar from "../ui/SentenceBar";
import Page from "../layout/Page";
import SymbolActionModal from "../modals/SymbolActionModal";
import { SymbolItem } from "../../types";

const { LayoutGrid, Folder, Star, MessageCircle } = Icons;

export default function HomeView() {
  const { categories, addToSentence, speak, settings } = useAAC();
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolItem | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);

  const quickAccess = categories.find((c) => c.id === "core");
  const otherCategories = categories.filter((c) => c.id !== "core");

  const handlePressSymbol = (item: any) => {
    if (!settings.speakOnlyOnPlay) {
      speak(item.speechText || item.label);
    } else {
      addToSentence(item);
    }
  };

  const handleLongPressSymbol = (item: SymbolItem) => {
    setSelectedSymbol(item);
    setShowActionModal(true);
  };

  return (
    <Page>
      <SentenceBar />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {quickAccess?.items.length ? (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View style={[styles.headerIconBadge, { backgroundColor: "#e0f2fe" }]}>
                <Star size={20} color="#0284c7" fill="#0284c7" />
              </View>
              <Text style={styles.sectionTitle}>Acesso Rápido</Text>
            </View>

            <View style={styles.grid}>
              {quickAccess.items.map((item) => (
                <SymbolCard
                  key={item.id}
                  item={item}
                  onPress={() => handlePressSymbol(item)}
                  onLongPress={() => handleLongPressSymbol(item)}
                />
              ))}
            </View>
          </View>
        ) : null}

        {otherCategories.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View style={[styles.headerIconBadge, { backgroundColor: "#f3e8ff" }]}>
                <LayoutGrid size={20} color="#9333ea" />
              </View>
              <Text style={styles.sectionTitle}>Categorias</Text>
            </View>

            <View style={styles.grid}>
              {otherCategories.map((cat) => {
                const IconComponent = (Icons as any)[cat.icon] || Folder;

                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.catCard, { backgroundColor: `${cat.color}15`, borderColor: `${cat.color}30` }]}
                    onPress={() => router.push(`/category/${cat.id}`)}
                  >
                      <View style={[styles.catIconContainer, { backgroundColor: cat.color }]}>
                        <IconComponent size={32} color="white" />
                      </View>
                      <Text style={styles.catText}>{cat.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {!quickAccess && otherCategories.length === 0 && (
          <View style={styles.emptyState}>
            <MessageCircle size={48} color="#cbd5e1" />
            <Text>Nenhum símbolo configurado</Text>
          </View>
        )}
      </ScrollView>

      <SymbolActionModal
        visible={showActionModal}
        onClose={() => setShowActionModal(false)}
        item={selectedSymbol}
        categoryId="core"
        onEdit={() => {}}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 120, gap: 16 },

  sectionContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12
  },

  headerIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.5,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },

  catCard: {
    width: "47.5%",
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  catIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  catText: {
    fontWeight: "700",
    fontSize: 16,
    color: "#1e293b",
    textAlign: "center"
  },


  emptyState: {
    alignItems: "center",
    marginTop: 60
  }
});